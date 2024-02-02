#!/bin/bash
#

set -e
set -o pipefail

# Normalize SCRIPT_DIR
SCRIPT_DIR=$(dirname "$0")
cd "${SCRIPT_DIR}"
SCRIPT_DIR=$(pwd -LP)
cd - > /dev/null

RUN_COMPOSE_FILE="${SCRIPT_DIR}/docker-compose-running.local.yaml"

set +e

if [ -f "${RUN_COMPOSE_FILE}" ]; then
  echo "Looks like you have been bring up local deployment (docker-compose-running.local.yaml is presented). Try to execute 'down.sh' before." >&2
  exit 1
fi


FORCE_PULL="no"

# Check args
while [ "$1" != "" ]; do
	case "$1" in
		--force-pull)
			FORCE_PULL="yes"
			;;
		--)
			shift
			break
			;;
		*)
			echo "Unexpected argument '$1'" >&2
			exit 1
			;;
	esac
	shift
done

if [ ! -f "${SCRIPT_DIR}/startup.config.local" ]; then
	echo "# Use this file for override startup configuration variables defined in the file startup.config" >> "${SCRIPT_DIR}/startup.config.local"
	echo >> "${SCRIPT_DIR}/startup.config.local"
fi

if [ ! -f "${SCRIPT_DIR}/startup.config.shared" ]; then
	echo "# TBD" >> "${SCRIPT_DIR}/startup.config.shared"
	echo >> "${SCRIPT_DIR}/startup.config.shared"
fi


touch "${SCRIPT_DIR}/configs/api.env.shared"
touch "${SCRIPT_DIR}/configs/backoffice.env.shared"
touch "${SCRIPT_DIR}/configs/web.env.shared"

touch "${SCRIPT_DIR}/configs/api.env.local"
touch "${SCRIPT_DIR}/configs/backoffice.env.local"
touch "${SCRIPT_DIR}/configs/web.env.local"

set -e

# alias curl='docker run --rm --tty rancher/curl 2>/dev/null'
#alias jq='docker run --rm --tty ...'
#alias yq='docker run --rm --tty ...'

# set +e
# jq --version >/dev/null 2>&1
# if [ $? -ne 0 ]; then
# 	echo "You have to install 'jq' utility." >&2
# 	exit 1
# fi

# yq --version >/dev/null 2>&1
# if [ $? -ne 0 ]; then
# 	echo "You have to install 'yq' utility." >&2
# 	exit 1
# fi
# set -e

echo "Resolving startup.config.shared and startup.config.local files ..."

# Resolve symlink case
if [ "$(uname)" = "Darwin" ]; then
	export IS_LINUX_HOST=""

	#  Mac OS X platform
	if [ -L "${SCRIPT_DIR}/startup.config.local" ]; then
		STARTUP_LOCAL_CONFIG_FILE=$(readlink "${SCRIPT_DIR}/startup.config.local")
	else
		STARTUP_LOCAL_CONFIG_FILE="${SCRIPT_DIR}/startup.config.local"
	fi

	if [ -L "${SCRIPT_DIR}/startup.config.shared" ]; then
		STARTUP_SHARED_CONFIG_FILE=$(readlink "${SCRIPT_DIR}/startup.config.shared")
	else
		STARTUP_SHARED_CONFIG_FILE="${SCRIPT_DIR}/startup.config.shared"
	fi
else
	export IS_LINUX_HOST="yes"

	STARTUP_LOCAL_CONFIG_FILE=$(readlink --canonicalize "${SCRIPT_DIR}/startup.config.local")
	STARTUP_SHARED_CONFIG_FILE=$(readlink --canonicalize "${SCRIPT_DIR}/startup.config.shared")
fi
export RUN_DOMAIN="$(hostname -d)"
export RUN_HOSTNAME="$(hostname -s)"


echo "Generating ${RUN_COMPOSE_FILE} ..."

cat "${SCRIPT_DIR}/templates/docker-compose.yaml.mustache" | \
  docker run \
    --interactive --rm \
    --mount "type=bind,source=${SCRIPT_DIR}/startup.config,target=/tmp/startup.config" \
    --mount "type=bind,source=${STARTUP_LOCAL_CONFIG_FILE},target=/tmp/startup.config.local" \
    --mount "type=bind,source=${STARTUP_SHARED_CONFIG_FILE},target=/tmp/startup.config.shared" \
    --env IS_LINUX_HOST --env RUN_DOMAIN --env RUN_HOSTNAME \
    theanurin/configuration-templates:20230324 \
      --engine mustache \
      --config-file=/tmp/startup.config \
      --config-file=/tmp/startup.config.shared \
      --config-env \
      --config-file=/tmp/startup.config.local \
    > "${RUN_COMPOSE_FILE}"
echo

if [ "${FORCE_PULL}" == "yes" ]; then
	echo
	# echo "Pulling images with '--quiet'... Be patient..."
	#docker compose --project-name "oidc-local-deployment" --file "${RUN_COMPOSE_FILE}" pull --quiet
	echo "Pulling images... Be patient..."
	docker compose --project-name "oidc-local-deployment" --file "${RUN_COMPOSE_FILE}" pull
	echo
fi

echo
echo "Launching Docker Compose for ${RUN_COMPOSE_FILE} ..."
exec docker compose --project-name "oidc-local-deployment" --file "${RUN_COMPOSE_FILE}" up "$@"
