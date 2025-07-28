// Docs: https://www.instantdb.com/docs/modeling-data
import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    profiles: i.entity({
      firstName: i.string().optional(),
      lastName: i.string().optional(),
      fullName: i.string().optional(),
      profilePicture: i.string().optional(),
      email: i.string().optional(),
      createdAt: i.date().optional(),
      updatedAt: i.date().optional(),
    }),
    runs: i.entity({
      user_id: i.string(),
      title: i.string(),
      description: i.string().optional(),
      activity_type: i.string(),
      route_data: i.string(),
      distance: i.number(),
      duration: i.number(),
      avg_pace: i.number(),
      elevation_gain: i.number().optional(),
      calories: i.number().optional(),
      weather: i.string().optional(),
      privacy: i.string(),
      created_at: i.number(),
      started_at: i.number(),
      ended_at: i.number(),
    }),
    run_stats: i.entity({
      run_id: i.string(),
      max_speed: i.number(),
      avg_speed: i.number(),
      total_points: i.number(),
      gps_accuracy_avg: i.number(),
    }),
  },
  links: {},
  rooms: {},
});

// Helps TypeScript autocomplete
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
