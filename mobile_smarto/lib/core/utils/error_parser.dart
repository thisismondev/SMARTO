String parseError(dynamic e) {
  final message = e.toString();
  const prefix = 'Exception: ';
  if (message.startsWith(prefix)) {
    return message.substring(prefix.length);
  }
  return message;
}
