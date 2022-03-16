import { Readable } from 'stream'

export default class FileDownload {
  data: Readable

  headers: Map<string, number | string | ReadonlyArray<string>>

  constructor(data: Readable, headers: Map<string, number | string | ReadonlyArray<string>>) {
    this.data = data
    this.headers = headers
  }
}
