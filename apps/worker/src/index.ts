import { startBinanceIngestion } from './jobs/binanceIngestion';
import { startAlertProcessor } from './jobs/alertProcessor';

console.log('Starting FinChart Pro background worker...');

// Start Binance realtime ingestion
startBinanceIngestion();

// Start Alert Processor
startAlertProcessor();
