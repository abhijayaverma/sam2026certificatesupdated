const hits = new Map<string, { count:number; reset:number }>();
export function rateLimit(key:string, limit=20, windowMs=60_000){ const now=Date.now(); const h=hits.get(key); if(!h||h.reset<now){hits.set(key,{count:1,reset:now+windowMs});return true} if(h.count>=limit)return false; h.count++; return true; }
