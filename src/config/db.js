import 'dotenv/config';
import fastifyPlugin from 'fastify-plugin';
import { createClient } from '@supabase/supabase-js';

export default fastifyPlugin(async (fastify) => {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    fastify.decorate('supabase', supabase);
});