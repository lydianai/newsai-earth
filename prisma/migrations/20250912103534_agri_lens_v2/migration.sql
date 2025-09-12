-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "public"."UserPlan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."SearchResultType" AS ENUM ('RAG', 'NEWS', 'QUANTUM', 'DIGITAL_TWIN', 'RESEARCH', 'PREDICTION');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('EARTHQUAKE', 'WILDFIRE', 'VOLCANO', 'STORM', 'FLOOD', 'DROUGHT', 'POLITICAL', 'ECONOMIC', 'TECH_OUTAGE');

-- CreateEnum
CREATE TYPE "public"."EventSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."QuantumAlgorithm" AS ENUM ('GROVER', 'SHOR', 'QAOA', 'VQE', 'DEUTSCH_JOZSA', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."IoTDeviceType" AS ENUM ('SMART_METER', 'WEATHER_STATION', 'ENERGY_MONITOR', 'AIR_QUALITY', 'CAMERA', 'SENSOR_GENERIC');

-- CreateEnum
CREATE TYPE "public"."AgentType" AS ENUM ('RESEARCHER', 'REPORTER', 'ANALYST', 'TRANSLATOR', 'FACT_CHECKER', 'CREATIVE', 'AUTOMATION');

-- CreateEnum
CREATE TYPE "public"."WorkflowTrigger" AS ENUM ('MANUAL', 'SCHEDULE', 'WEBHOOK', 'EVENT');

-- CreateEnum
CREATE TYPE "public"."WorkflowStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ReportFormat" AS ENUM ('MARKDOWN', 'PDF', 'HTML', 'JSON');

-- CreateEnum
CREATE TYPE "public"."CommunityRole" AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "public"."CropCategory" AS ENUM ('CEREALS', 'LEGUMES', 'FRUITS', 'VEGETABLES', 'NUTS_SEEDS', 'SPICES_HERBS', 'FIBER_CROPS', 'ENERGY_CROPS', 'FORAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."WaterRequirement" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "public"."YieldModelType" AS ENUM ('TIMESERIES', 'REGRESSION', 'ENSEMBLE', 'NEURAL_NETWORK');

-- CreateEnum
CREATE TYPE "public"."SupplyEventType" AS ENUM ('PORT_DELAY', 'TRANSPORTATION_DISRUPTION', 'STORAGE_SHORTAGE', 'TRADE_RESTRICTION', 'NATURAL_DISASTER', 'LABOR_SHORTAGE', 'FUEL_PRICE_SPIKE', 'CURRENCY_FLUCTUATION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."HealthStatus" AS ENUM ('HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'tr',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "plan" "public"."UserPlan" NOT NULL DEFAULT 'FREE',
    "credits" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_lens_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "queryLang" TEXT NOT NULL DEFAULT 'tr',
    "response" JSONB,
    "sources" JSONB[],
    "embedding" vector(1536),
    "resultType" "public"."SearchResultType" NOT NULL,
    "confidence" DOUBLE PRECISION,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_lens_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vault_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'text',
    "tags" TEXT[],
    "embedding" vector(1536),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."earthbrief_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "originalUrl" TEXT NOT NULL,
    "sourceRosette" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),
    "factScore" DOUBLE PRECISION,
    "consensusScore" DOUBLE PRECISION,
    "verifiedAt" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "country" TEXT,
    "tags" TEXT[],
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "earthbrief_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."live_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "public"."EventType" NOT NULL,
    "severity" "public"."EventSeverity" NOT NULL DEFAULT 'LOW',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sources" JSONB[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "live_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quantum_circuits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "circuitData" JSONB NOT NULL,
    "algorithm" "public"."QuantumAlgorithm" NOT NULL,
    "qubits" INTEGER NOT NULL,
    "gates" JSONB[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quantum_circuits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quantum_executions" (
    "id" TEXT NOT NULL,
    "circuitId" TEXT NOT NULL,
    "shots" INTEGER NOT NULL DEFAULT 1024,
    "results" JSONB NOT NULL,
    "statevector" JSONB,
    "fidelity" DOUBLE PRECISION,
    "executionTime" INTEGER,
    "backend" TEXT NOT NULL DEFAULT 'simulator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quantum_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."digital_twin_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "metrics" JSONB NOT NULL,
    "predictions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digital_twin_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."iot_devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deviceType" "public"."IoTDeviceType" NOT NULL,
    "mac" TEXT,
    "ipAddress" TEXT,
    "apiEndpoint" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "iot_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."iot_readings" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "sensorType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "iot_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_agents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "agentType" "public"."AgentType" NOT NULL,
    "systemPrompt" TEXT,
    "model" TEXT NOT NULL DEFAULT 'gpt-4',
    "maxTokens" INTEGER NOT NULL DEFAULT 2000,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "availableTools" JSONB[],
    "totalRuns" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agent_executions" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT,
    "tokensUsed" INTEGER,
    "duration" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workflows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "flowData" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "trigger" "public"."WorkflowTrigger" NOT NULL DEFAULT 'MANUAL',
    "schedule" TEXT,
    "totalRuns" INTEGER NOT NULL DEFAULT 0,
    "lastRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workflow_runs" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "public"."WorkflowStatus" NOT NULL DEFAULT 'RUNNING',
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "duration" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_lens_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "format" "public"."ReportFormat" NOT NULL DEFAULT 'MARKDOWN',
    "prompt" TEXT,
    "model" TEXT,
    "tokensUsed" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareSlug" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_lens_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."communities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "role" "public"."CommunityRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_posts" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "plan" "public"."UserPlan" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cache_entries" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "ttl" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cache_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "country" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."crops" (
    "id" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_tr" TEXT,
    "name_local" JSONB,
    "synonyms" TEXT[],
    "hs_codes" TEXT[],
    "category" "public"."CropCategory" NOT NULL,
    "water_need" "public"."WaterRequirement" NOT NULL DEFAULT 'MEDIUM',
    "growth_stages" TEXT[],
    "min_temp" DOUBLE PRECISION,
    "max_temp" DOUBLE PRECISION,
    "rainfall_min" DOUBLE PRECISION,
    "rainfall_max" DOUBLE PRECISION,
    "global_production" DOUBLE PRECISION,
    "major_producers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."countries" (
    "id" TEXT NOT NULL,
    "iso2" TEXT NOT NULL,
    "iso3" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_local" TEXT,
    "regions" TEXT[],
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "area_km2" DOUBLE PRECISION,
    "climate_zones" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."crop_country_profiles" (
    "id" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "area_avg" DOUBLE PRECISION,
    "yield_avg" DOUBLE PRECISION,
    "production_avg" DOUBLE PRECISION,
    "planting_window" TEXT,
    "harvest_window" TEXT,
    "season_notes" TEXT,
    "price_avg" DOUBLE PRECISION,
    "export_volume" DOUBLE PRECISION,
    "domestic_use" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crop_country_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ndvi_series" (
    "id" TEXT NOT NULL,
    "region_key" TEXT NOT NULL,
    "countryId" TEXT,
    "timestamps" TIMESTAMP(3)[],
    "ndvi_values" DOUBLE PRECISION[],
    "resolution" TEXT NOT NULL DEFAULT 'low',
    "provider" TEXT NOT NULL DEFAULT 'open',
    "bbox" TEXT,
    "mean_value" DOUBLE PRECISION,
    "min_value" DOUBLE PRECISION,
    "max_value" DOUBLE PRECISION,
    "anomalies" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ndvi_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."yield_models" (
    "id" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "countryId" TEXT,
    "region_key" TEXT NOT NULL,
    "model_type" "public"."YieldModelType" NOT NULL DEFAULT 'TIMESERIES',
    "features" JSONB NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'hf_timeseries',
    "hyperparams" JSONB,
    "mae" DOUBLE PRECISION,
    "rmse" DOUBLE PRECISION,
    "r2_score" DOUBLE PRECISION,
    "forecast_horizon" INTEGER NOT NULL DEFAULT 90,
    "last_prediction" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yield_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."supply_events" (
    "id" TEXT NOT NULL,
    "event_type" "public"."SupplyEventType" NOT NULL,
    "countryId" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "location_name" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "public"."EventSeverity" NOT NULL DEFAULT 'LOW',
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "duration_hours" INTEGER,
    "crops_affected" TEXT[],
    "regions_affected" TEXT[],
    "economic_impact" DOUBLE PRECISION,
    "source_type" TEXT NOT NULL DEFAULT 'feed',
    "source_url" TEXT,
    "source_reliability" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supply_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."advice_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "cropId" TEXT NOT NULL,
    "growth_stage" TEXT NOT NULL,
    "soil_type" TEXT,
    "weather_data" JSONB,
    "risk_factors" JSONB,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "country_code" TEXT,
    "language" TEXT NOT NULL DEFAULT 'tr',
    "quick_tips" TEXT[],
    "plan_low_cost" TEXT,
    "plan_standard" TEXT,
    "plan_premium" TEXT,
    "cautions" TEXT[],
    "model_used" TEXT NOT NULL DEFAULT 'gpt-4',
    "tokens_used" INTEGER,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advice_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."esg_snapshots" (
    "id" TEXT NOT NULL,
    "region_key" TEXT NOT NULL,
    "countryId" TEXT,
    "cropId" TEXT,
    "water_use_m3" DOUBLE PRECISION,
    "co2_intensity" DOUBLE PRECISION,
    "soil_health_index" DOUBLE PRECISION,
    "calculation_method" TEXT,
    "data_sources" JSONB[],
    "assumptions" JSONB,
    "confidence" DOUBLE PRECISION,
    "measurement_year" INTEGER,
    "measurement_season" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "esg_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plant_health_detections" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "cropId" TEXT,
    "image_url" TEXT,
    "image_hash" TEXT,
    "image_size_kb" INTEGER,
    "detected_issues" JSONB[],
    "overall_health" TEXT,
    "confidence" DOUBLE PRECISION,
    "model_used" TEXT NOT NULL DEFAULT 'plant-disease-classifier',
    "processing_time" INTEGER,
    "growth_stage" TEXT,
    "location_notes" TEXT,
    "user_notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plant_health_detections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_health" (
    "id" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "status" "public"."HealthStatus" NOT NULL DEFAULT 'UNKNOWN',
    "last_check" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response_time" INTEGER,
    "error_message" TEXT,
    "avg_response_time" DOUBLE PRECISION,
    "uptime_pct" DOUBLE PRECISION,
    "total_requests" INTEGER NOT NULL DEFAULT 0,
    "failed_requests" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_health_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "public"."user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ai_lens_reports_shareSlug_key" ON "public"."ai_lens_reports"("shareSlug");

-- CreateIndex
CREATE UNIQUE INDEX "communities_name_key" ON "public"."communities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "communities_slug_key" ON "public"."communities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "community_memberships_userId_communityId_key" ON "public"."community_memberships"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "public"."subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCustomerId_key" ON "public"."subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "public"."subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "cache_entries_key_key" ON "public"."cache_entries"("key");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso2_key" ON "public"."countries"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso3_key" ON "public"."countries"("iso3");

-- CreateIndex
CREATE UNIQUE INDEX "crop_country_profiles_cropId_countryId_key" ON "public"."crop_country_profiles"("cropId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "system_health_component_key" ON "public"."system_health"("component");

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_lens_searches" ADD CONSTRAINT "ai_lens_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vault_items" ADD CONSTRAINT "vault_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quantum_circuits" ADD CONSTRAINT "quantum_circuits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quantum_executions" ADD CONSTRAINT "quantum_executions_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "public"."quantum_circuits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."digital_twin_data" ADD CONSTRAINT "digital_twin_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."iot_devices" ADD CONSTRAINT "iot_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."iot_readings" ADD CONSTRAINT "iot_readings_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."iot_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_agents" ADD CONSTRAINT "ai_agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."agent_executions" ADD CONSTRAINT "agent_executions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."ai_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workflows" ADD CONSTRAINT "workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workflow_runs" ADD CONSTRAINT "workflow_runs_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_lens_reports" ADD CONSTRAINT "ai_lens_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_memberships" ADD CONSTRAINT "community_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_memberships" ADD CONSTRAINT "community_memberships_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_posts" ADD CONSTRAINT "community_posts_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."crop_country_profiles" ADD CONSTRAINT "crop_country_profiles_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "public"."crops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."crop_country_profiles" ADD CONSTRAINT "crop_country_profiles_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ndvi_series" ADD CONSTRAINT "ndvi_series_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."yield_models" ADD CONSTRAINT "yield_models_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "public"."crops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."yield_models" ADD CONSTRAINT "yield_models_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supply_events" ADD CONSTRAINT "supply_events_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."advice_logs" ADD CONSTRAINT "advice_logs_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "public"."crops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."esg_snapshots" ADD CONSTRAINT "esg_snapshots_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."esg_snapshots" ADD CONSTRAINT "esg_snapshots_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "public"."crops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plant_health_detections" ADD CONSTRAINT "plant_health_detections_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "public"."crops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
