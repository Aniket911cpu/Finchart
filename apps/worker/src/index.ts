import { startBinanceIngestion } from './jobs/binanceIngestion';

console.log('Starting FinChart Pro background worker...');

// Start Binance realtime ingestion
startBinanceIngestion();

// Here we would also configure BullMQ queues if needed for other jobs
