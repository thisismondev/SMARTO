import 'dart:developer';

import 'package:supabase_flutter/supabase_flutter.dart';

import '../model/sensor_reading_model.dart';

class SensorApi {
  static final SupabaseClient _supabase = Supabase.instance.client;

  static Future<SensorReadingModel?> fetchLatestSensor({
    required int kodeNodeId,
  }) async {
    final response = await _supabase
        .from('sensor_readings')
        .select()
        .eq('kode_node_id', kodeNodeId)
        .order('created_at', ascending: false)
        .limit(1);

    if (response.isEmpty) {
      return null;
    }

    log(
      'Latest sensor response: $response',
      name: 'SensorApi.fetchLatestSensor',
    );

    return SensorReadingModel.fromJson(response.first);
  }

  static RealtimeChannel subscribeSensor({
    required int kodeNodeId,
    required void Function(SensorReadingModel sensor) onData,
  }) {
    final channel = _supabase.channel('sensor_readings_$kodeNodeId');

    channel.onPostgresChanges(
      event: PostgresChangeEvent.all,
      schema: 'public',
      table: 'sensor_readings',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.eq,
        column: 'kode_node_id',
        value: kodeNodeId,
      ),
      callback: (payload) {
        final newRecord = payload.newRecord;

        log(
          'Realtime payload: $newRecord',
          name: 'SensorApi.subscribeSensor',
        );

        if (newRecord.isEmpty) return;

        final sensor = SensorReadingModel.fromJson(newRecord);

        onData(sensor);
      },
    );

    channel.subscribe();

    return channel;
  }

  static Future<void> removeChannel(RealtimeChannel channel) async {
    await _supabase.removeChannel(channel);
  }
}