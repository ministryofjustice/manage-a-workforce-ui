// eslint-disable-next-line import/no-extraneous-dependencies
import { RedisFlushModes } from '@redis/client/dist/lib/commands/FLUSHALL'
import { createRedisClient } from '../../server/data/redisClient'

export default class RedisService {
  async deleteAll(): Promise<string> {
    const redisClient = createRedisClient()
    await redisClient.connect()
    const result = await redisClient.flushAll(RedisFlushModes.SYNC)
    await redisClient.quit()
    return result
  }
}
