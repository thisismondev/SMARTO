class UserModel {
  final int id;
  final String username;
  final String email;
  final int roleId;
  final String role;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.roleId,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      roleId: json['role_id'] ?? json['roleId'] ?? 0,
      role: json['role'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'role_id': roleId,
      'role': role,
    };
  }
}