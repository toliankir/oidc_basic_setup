import Redis from "ioredis"; // eslint-disable-line import/no-unresolved
import isEmpty from 'lodash/isEmpty.js';

if (!process.env.REDIS_URL) {
throw new Error("REDIS_URL must be set");
}

const client = new Redis(process.env.REDIS_URL, { keyPrefix: 'oidc:' });

const grantable = new Set([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
]);

const consumable = new Set([
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
]);

function grantKeyFor(id: string) {
  return `grant:${id}`;
}

function userCodeKeyFor(userCode: string) {
  return `userCode:${userCode}`;
}

function uidKeyFor(uid: string) {
  return `uid:${uid}`;
}

class RedisAdapter {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  async upsert(id: string, payload: any, expiresIn: number) {
    const key = this.key(id);
    const store = consumable.has(this.name)
      ? { payload: JSON.stringify(payload) } : JSON.stringify(payload);

    const multi = client.multi();
    (multi[consumable.has(this.name) ? 'hmset' : 'set'] as any)(key, store);

    if (expiresIn) {
      multi.expire(key, expiresIn);
    }

    if (grantable.has(this.name) && payload.grantId) {
      const grantKey = grantKeyFor(payload.grantId);
      multi.rpush(grantKey, key);
      // if you're seeing grant key lists growing out of acceptable proportions consider using LTRIM
      // here to trim the list to an appropriate length
      const ttl = await client.ttl(grantKey);
      if (expiresIn > ttl) {
        multi.expire(grantKey, expiresIn);
      }
    }

    if (payload.userCode) {
      const userCodeKey = userCodeKeyFor(payload.userCode);
      multi.set(userCodeKey, id);
      multi.expire(userCodeKey, expiresIn);
    }

    if (payload.uid) {
      const uidKey = uidKeyFor(payload.uid);
      multi.set(uidKey, id);
      multi.expire(uidKey, expiresIn);
    }

    await multi.exec();
  }

  async find(id: string | null) {
    if (id === null) {
      throw new Error("unexpected id is null");
    }

    const data = consumable.has(this.name)
      ? await client.hgetall(this.key(id))
      : await client.get(this.key(id));

    if (isEmpty(data)) {
      return undefined;
    }

    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    const { payload, ...rest } = data as any;
    return {
      ...rest,
      ...JSON.parse(payload),
    };
  }

  async findByUid(uid: string) {
    const id = await client.get(uidKeyFor(uid));
    return this.find(id);
  }

  async findByUserCode(userCode: string) {
    const id = await client.get(userCodeKeyFor(userCode));
    return this.find(id);
  }

  async destroy(id: string) {
    const key = this.key(id);
    await client.del(key);
  }

  async revokeByGrantId(grantId: string) { // eslint-disable-line class-methods-use-this
    const multi = client.multi();
    const tokens = await client.lrange(grantKeyFor(grantId), 0, -1);
    tokens.forEach((token: string) => multi.del(token));
    multi.del(grantKeyFor(grantId));
    await multi.exec();
  }

  async consume(id: string) {
    await client.hset(this.key(id), 'consumed', Math.floor(Date.now() / 1000));
  }

  key(id: string) {
    return `${this.name}:${id}`;
  }
}

export default RedisAdapter;
