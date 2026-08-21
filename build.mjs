import { build } from 'vite';

console.log('Starting Vite build for Payflow...');
try {
  await build({
    root: 'C:/Users/KIIT/Desktop/Payflow',
  });
  console.log('Vite build completed successfully!');
} catch (error) {
  console.error('Vite build error:', error);
  process.exit(1);
}
