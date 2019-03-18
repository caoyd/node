const Constants = {
  HMAC_SHA256: 'HmacSHA256', 	// 签名算法HmacSha256
  ENCODING: 'UTF-8', // 编码UTF-8
  USER_AGENT: 'demo/aliyun/java', // UserAgent
  LF: '\n', // 换行符
  SPE1: ',', // 分隔符1
  SPE2: ':', // 分隔符2
  DEFAULT_TIMEOUT: 1000, // 默认请求超时时间,单位毫秒
  CA_HEADER_TO_SIGN_PREFIX_SYSTEM: 'X-CA-' // 参与签名的系统Header前缀,只有指定前缀的Header才会参与到签名中
};
const ContentType = {
  // 表单类型Content-Type
  CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded; charset=UTF-8',
  // 流类型Content-Type
  CONTENT_TYPE_STREAM: 'application/octet-stream; charset=UTF-8',
  // JSON类型Content-Type
  CONTENT_TYPE_JSON: 'application/json; charset=UTF-8',
  // XML类型Content-Type
  CONTENT_TYPE_XML: 'application/xml; charset=UTF-8',
  // 文本类型Content-Type
  CONTENT_TYPE_TEXT: 'application/text; charset=UTF-8',
};
const HttpHeader = {
  // 请求Header Accept
  HTTP_HEADER_ACCEPT: 'Accept',
  // 请求Body内容MD5 Header
  HTTP_HEADER_CONTENT_MD5: 'Content-MD5',
  // 请求Header Content-Type
  HTTP_HEADER_CONTENT_TYPE: 'Content-Type',
  // 请求Header UserAgent
  HTTP_HEADER_USER_AGENT: 'User-Agent',
  // 请求Header Date
  HTTP_HEADER_DATE: 'Date',
};
const HttpMethod = {
  // GET
  GET: 'GET',
  // POST
  POST: 'POST',
  // PUT
  PUT: 'PUT',
  // DELETE
  DELETE: 'DELETE',
  // HEAD
  HEAD: 'HEAD',
};
const HttpSchema = {
  HTTP: 'http://',
  HTTPS: 'https://'
};
const SystemHeader = {
  X_CA_SIGNATURE: 'X-Ca-Signature', // 签名Header
  X_CA_SIGNATURE_HEADERS: 'X-Ca-Signature-Headers', // 所有参与签名的Header
  X_CA_TIMESTAMP: 'X-Ca-Timestamp', // 请求时间戳
  X_CA_NONCE: 'X-Ca-Nonce', // 请求放重放Nonce,15分钟内保持唯一,建议使用UUID
  X_CA_KEY: 'X-Ca-Key', // APP KEY
};

module.exports = {
  Constants,
  ContentType,
  HttpHeader,
  HttpMethod,
  HttpSchema,
  SystemHeader
};
