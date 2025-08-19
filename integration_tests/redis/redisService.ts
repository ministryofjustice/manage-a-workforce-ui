import { createRedisClient } from '../../server/data/redisClient'

export default class RedisService {
  async deleteAll(): Promise<ReturnType<typeof redisClient.flushAll>> {
    const redisClient = createRedisClient()
    await redisClient.connect()
    const result = await redisClient.flushAll('SYNC')
    await redisClient.quit()
    return result
  }
}
