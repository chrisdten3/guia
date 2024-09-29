// app/page.js
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/landing'); // Redirect to the landing page
}
