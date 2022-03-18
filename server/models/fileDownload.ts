export default class FileDownload {
  data: NodeJS.ReadableStream

  headers: Map<string, number | string | ReadonlyArray<string>>

  constructor(data: NodeJS.ReadableStream, headers: Map<string, number | string | ReadonlyArray<string>>) {
    this.data = data
    this.headers = headers
  }
}
