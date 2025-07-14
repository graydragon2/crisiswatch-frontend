--- components/FeedList.jsx
+++ components/FeedList.jsx
@@
-import { useState, useEffect } from 'react';
-
-const BACKEND_URL = 'https://crisiswatch-api-production.up.railway.app';
+import { useState, useEffect } from 'react';
+import { BACKEND_URL } from '@/lib/api';

 export default function FeedList() {
   const [feeds, setFeeds] = useState([]);
@@
   const fetchFeeds = async () => {
     try {
-      const res = await fetch(`${BACKEND_URL}/api/feeds`);
+      const res = await fetch(`${BACKEND_URL}/api/feeds`);
       const json = await res.json();
       setFeeds(json.feeds || []);
     } catch (err) {
       console.error(err);
       setError('Failed to load feeds.');
     }
   };

   const addFeed = async () => {
     if (!newFeed) return;
     try {
-      const res = await fetch(`${BACKEND_URL}/api/feeds`, {
+      const res = await fetch(`${BACKEND_URL}/api/feeds`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ url: newFeed }),
       });
@@
       if (!res.ok) throw new Error('Failed to add feed');
       setNewFeed('');
       fetchFeeds();
     } catch (err) {
       console.error(err);
       setError('Error adding feed.');
     }
   };

   return (
     <div className="space-y-2">
       …  
     </div>
   );
}