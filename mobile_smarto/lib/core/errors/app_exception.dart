class AppException implements Exception {
  final String message;
  final int? statusCode;

  const AppException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class TokenExpiredException extends AppException {
  const TokenExpiredException() : super('Sesi telah berakhir, silakan login kembali');
}

class ServerException extends AppException {
  const ServerException(super.message, {super.statusCode});
}

class NetworkException extends AppException {
  const NetworkException() : super('Tidak ada koneksi internet');
}

class TimeoutException extends AppException {
  const TimeoutException() : super('Koneksi ke server timeout, silakan coba lagi');
}
