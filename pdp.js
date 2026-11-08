(() => {
 const panel=document.querySelector('.piece-actions');
 if(!panel) return;
 const id=Number(new URLSearchParams(location.search).get('id'));
 const piece=repositoryPieces.find(item=>item.id===id) || repositoryPieces[0];
 const type=piece.type || (piece.id===9 ? 'Vessel' : piece.id===10 ? 'Bowl' : [3,8].includes(piece.id) ? 'Collection' : 'Cup');
 document.querySelectorAll('[data-piece-type]').forEach(element=>{element.textContent=type;});
 // The dimensions below are wireframe sample copy until real measurements arrive.
 document.querySelectorAll('[data-piece-dimensions]').forEach(element=>{element.textContent=piece.dimensions || '100cm by 200cm';});
 const heading=document.querySelector('.piece-info h1');
 const mobileViewport=matchMedia('(max-width:767px)');
 let scheduled=false;
 function setCompact() {
  scheduled=false;
  if(document.body.classList.contains('menu-open') || document.body.classList.contains('gallery-open') || document.body.classList.contains('sheet-open')) return;
  // Switch once the inline title is fully above the compact action bar.
  const rect=heading.getBoundingClientRect();
  // A small return margin prevents flickering around the transition point.
  const wasCompact=document.body.classList.contains('piece-actions-compact');
  const hasScrolled=!window.pdpPreview || scrollY>32;
  const compact=mobileViewport.matches && hasScrolled && rect.bottom<=innerHeight-80+(wasCompact ? 12 : 0);
  document.body.classList.toggle('piece-actions-compact',compact);
  document.querySelector('.piece-action-summary').setAttribute('aria-hidden',String(compact));
 }
 function requestUpdate() {
  if(!scheduled) { scheduled=true;requestAnimationFrame(setCompact); }
 }
 addEventListener('scroll',requestUpdate,{passive:true});
 addEventListener('resize',requestUpdate);
 addEventListener('pageshow',requestUpdate);
 document.addEventListener('close',requestUpdate,true);
 mobileViewport.addEventListener('change',requestUpdate);
 setCompact();
 document.querySelector('#leave-note').addEventListener('click',()=>{
  const form=document.querySelector('#comment-form');
  form.scrollIntoView({block:'center',behavior:prefersReducedMotion() ? 'instant' : 'smooth'});
  document.querySelector('#comment-text').focus({preventScroll:true});
 });
 const button=document.querySelector('#add-to-bag');
 const status=document.querySelector('#piece-action-status');
 let bag=[];
 try { const stored=JSON.parse(localStorage.getItem('keoneo-bag') || '[]'); if(Array.isArray(stored)) bag=stored; } catch {}
 const hasPiece=()=>bag.some(item=>item?.id===piece.id);
 if(hasPiece()) button.textContent='ADDED TO BAG';
 button.addEventListener('click',()=>{
  if(!hasPiece()) bag.push({id:piece.id,title:piece.title,quantity:1});
  let saved=false;
  try { localStorage.setItem('keoneo-bag',JSON.stringify(bag)); saved=true; } catch {}
  button.textContent='ADDED TO BAG';
  status.textContent=saved ? `${piece.title} added to your bag.` : `${piece.title} added for this preview session.`;
 });
})();
