#!/bin/bash

DOMAIN=$1

echo "authorityKeyIdentifier=keyid,issuer" > "${DOMAIN}-tls.cnf"
echo "basicConstraints=CA:FALSE" >> "${DOMAIN}-tls.cnf"
echo "keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment" >> "${DOMAIN}-tls.cnf"
echo "subjectAltName = @alt_names" >> "${DOMAIN}-tls.cnf"
echo "" >> "${DOMAIN}-tls.cnf"
echo "[alt_names]" >> "${DOMAIN}-tls.cnf"
echo "DNS.1 = ${DOMAIN}" >> "${DOMAIN}-tls.cnf"
echo "DNS.2 = *.${DOMAIN}" >> "${DOMAIN}-tls.cnf"

echo "${DOMAIN}-tls.cnf"
cat "${DOMAIN}-tls.cnf"
