// Image sets are shared by the archive, PDP, and quick gallery.
const media = (file, alt) => ({ file, alt });
const studioWorktable = media('21-editorial-worktable', 'The cup collection on a studio worktable');
const studioShelf = media('27-editorial-shelf', 'Six ceramic cups arranged on a studio shelf');
const studioKiln = media('23-editorial-kiln', 'Ceramics inside the studio kiln');
const linenPair = media('28-editorial-linen-pair', 'Two ceramic cups resting on linen');
const process = media('22-editorial-process', 'A dark glazed cup on the pottery worktable');
const imageSets = [
 [media('01-catalog-cup-1-front','Cream glazed cup, front view'), media('02-catalog-cup-1-three-quarter','Cream glazed cup, angled view'), studioWorktable, studioShelf, media('25-editorial-window-tea','Ceramics beside a sunlit window')],
 [media('03-catalog-cup-2-front','Dark brown cup, front view'), media('04-catalog-cup-2-three-quarter','Dark brown cup, angled view'), linenPair, studioWorktable, studioShelf],
 [studioWorktable, studioShelf, media('13-catalog-six-cup-collection','Six handmade cups together'), studioKiln, linenPair],
 [media('05-catalog-cup-3-front','Olive glazed cup, front view'), media('06-catalog-cup-3-three-quarter','Olive glazed cup, angled view'), media('19-catalog-speckled-cup-close','Close view of a speckled cup'), studioWorktable, studioShelf],
 [media('07-catalog-cup-4-front','Charcoal glazed cup, front view'), media('08-catalog-cup-4-three-quarter','Charcoal glazed cup, angled view'), media('20-catalog-glaze-macro','Detail of the charcoal glaze'), process, studioWorktable],
 [media('09-catalog-cup-5-front','Golden glazed cup, front view'), media('10-catalog-cup-5-three-quarter','Golden glazed cup, angled view'), studioWorktable, studioShelf, studioKiln],
 [media('11-catalog-cup-6-front','Pale glazed cup, front view'), media('12-catalog-cup-6-three-quarter','Pale glazed cup, angled view'), studioShelf, studioWorktable, studioKiln],
 [process, studioKiln, media('14-catalog-two-cups','Two ceramic cups together'), studioWorktable, studioShelf],
 [media('15-catalog-sculptural-vessel','Sculptural lidded vessel'), media('16-catalog-vessel-detail','Close view of the vessel lid'), studioKiln, studioWorktable, process],
 [media('17-catalog-footed-bowl-front','Footed ceramic bowl'), media('18-catalog-footed-bowl-detail','Close view of the footed bowl'), media('24-editorial-dry-grass','Footed bowl in dry grass'), media('25-editorial-window-tea','Footed bowl beside a sunlit window'), media('30-editorial-quiet-still-life','Ceramics in warm sunlight')],
];
const repositoryPieces = imageSets.map((images,index) => ({
 id:index+1, title:`Untitled ${38+index}`, label:`Ceramic [${index+1}]`,
 category:['Prototypes','Prototypes','Sketches','Failures','Prototypes','Prototypes','Failures','Sketches','Prototypes','Failures'][index],
 wide:index===2 || index===7, tall:index===7, images,
}));
function imageElement(item, { thumbnail=false, eager=false }={}) {
 const image=document.createElement('img');
 const base=`images/ecommerce/web/${item.file}`;
 image.src=`${base}-${thumbnail ? 96 : 1120}.webp`;
 if(!thumbnail) { image.srcset=`${base}-480.webp 480w, ${base}-1120.webp 1120w`; image.sizes='(max-width:767px) 100vw, 1200px'; }
 image.alt=item.alt; image.loading=eager ? 'eager' : 'lazy'; image.decoding='async'; image.draggable=false;
 return image;
}
const prefersReducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function createCarousel(images, { label, href, onOpen, eager=false, initial=0 }={}) {
 const carousel=document.createElement('div'); carousel.className='media-carousel';
 carousel.setAttribute('role','region'); carousel.setAttribute('aria-label',label);
 const track=document.createElement('div'); track.className='media-track';
 const bars=document.createElement('div'); bars.className='swipe-bars'; bars.setAttribute('role','group'); bars.setAttribute('aria-label',`${label} images`);
 let active=0; let measuredWidth=0; let pointerOrigin; let dragged=false;
 track.addEventListener('pointerdown',event=>{
  pointerOrigin={x:event.clientX,y:event.clientY,scrollLeft:track.scrollLeft}; dragged=false;
 });
 track.addEventListener('pointermove',event=>{
  if(!pointerOrigin || event.pointerType==='mouse') return;
  const dx=Math.abs(event.clientX-pointerOrigin.x);
  const dy=Math.abs(event.clientY-pointerOrigin.y);
  if(dx>18 && dx>dy) dragged=true;
 });
 function finishPointer() {
  if(pointerOrigin && Math.abs(track.scrollLeft-pointerOrigin.scrollLeft)>10) dragged=true;
  pointerOrigin=null;
 }
 track.addEventListener('pointerup',finishPointer);
 track.addEventListener('pointercancel',finishPointer);
 // Suppress only a real horizontal gesture; cancellation alone is not a swipe.
 track.addEventListener('click',event=>{
  if(dragged && event.detail!==0) {event.preventDefault();event.stopImmediatePropagation();}
  dragged=false;
 },true);
 const buttons=[];
 function sync() {
  if(measuredWidth && Math.abs(track.clientWidth-measuredWidth)>1) return;
  measuredWidth=track.clientWidth;
  active=Math.max(0,Math.min(images.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));
  buttons.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===active)));
 }
 function goTo(index) { track.scrollTo({left:index*track.clientWidth,behavior:prefersReducedMotion() ? 'instant' : 'smooth'}); }
 images.forEach((item,index)=>{
  const slide=document.createElement(href ? 'a' : 'button'); slide.className='media-slide'; slide.draggable=false;
  if(href) slide.href=href(index); else { slide.type='button'; slide.addEventListener('click',()=>onOpen(index,slide)); }
  slide.setAttribute('aria-label',`${label}, image ${index+1}: ${item.alt}`);
  slide.append(imageElement(item,{eager:eager && index===initial})); track.append(slide);
  const button=document.createElement('button'); button.type='button';
  button.setAttribute('aria-label',`Show image ${index+1} of ${images.length}`); button.setAttribute('aria-pressed',String(index===0));
  button.addEventListener('click',()=>goTo(index)); bars.append(button); buttons.push(button);
 });
 track.addEventListener('scroll',sync,{passive:true});
 track.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight' || event.key==='ArrowLeft') { event.preventDefault(); goTo(Math.max(0,Math.min(images.length-1,active+(event.key==='ArrowRight' ? 1 : -1)))); }
 });
 const resize=new ResizeObserver(()=>{measuredWidth=track.clientWidth;track.scrollLeft=active*track.clientWidth;});resize.observe(track);
 carousel.append(track,bars);
 requestAnimationFrame(()=>{track.scrollLeft=initial*track.clientWidth;sync();});
 carousel.destroy=()=>resize.disconnect();
 return carousel;
}
const repositoryItems = document.querySelector('#repository-items');
const params = new URLSearchParams(location.search);
let view = params.get('view') === 'grid' ? 'grid' : 'list';
let category = ['All','Prototypes','Failures','Sketches'].includes(params.get('filter')) ? params.get('filter') : 'All';
const filterToggle = document.querySelector('#filter-toggle');
const filterOptions = document.querySelector('#filter-options');
function closeFilter() {
  if (!filterOptions) return;
  filterOptions.hidden = true;
  filterToggle.setAttribute('aria-expanded','false');
  document.querySelector('.repository-main').classList.remove('filter-open');
}
function renderRepository() {
  repositoryItems.querySelectorAll('.media-carousel').forEach(carousel=>carousel.destroy());
  repositoryItems.replaceChildren();
  repositoryItems.classList.toggle('is-grid',view === 'grid');
  const visible = repositoryPieces.filter(piece => category === 'All' || piece.category === category);
  const pieces = visible;
  for (const piece of pieces) {
    const card=document.createElement('article');
    card.className=`repository-card${piece.wide ? ' wide' : ''}${piece.tall ? ' tall' : ''}`;
    const url=index=>`piece.html?${new URLSearchParams({id:piece.id,view,filter:category,image:index})}`;
    const figure=document.createElement('figure');
    const carousel=createCarousel(piece.images.slice(0,3),{label:piece.label,href:url,eager:piece.id<=2});
    const caption=document.createElement('figcaption'); const link=document.createElement('a');
    link.href=url(0); link.textContent=piece.label; caption.append(link);
    figure.append(carousel,caption);card.append(figure);repositoryItems.append(card);
  }
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.view === view)));
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filter === category)));
  filterToggle.querySelector('span').textContent = category;
  const query = new URLSearchParams({view,filter:category});
  history.replaceState(null,'',`${location.pathname}?${query}`);
}
if (repositoryItems) {
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click',() => { view=button.dataset.view; closeFilter(); renderRepository(); }));
  filterToggle.addEventListener('click',() => {
    const open = filterOptions.hidden;
    filterOptions.hidden = !open;
    filterToggle.setAttribute('aria-expanded',String(open));
    document.querySelector('.repository-main').classList.toggle('filter-open',open);
    if (open) filterOptions.querySelector('[aria-pressed=true]').focus();
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => { category=button.dataset.filter; closeFilter(); renderRepository(); filterToggle.focus(); }));
  document.addEventListener('keydown',event => { if(event.key === 'Escape' && !filterOptions.hidden) { closeFilter(); filterToggle.focus(); } });
  renderRepository();
}
const inviteForm = document.querySelector('#invite-form');
if (inviteForm) inviteForm.addEventListener('submit',event => {
  event.preventDefault();
  // Prepare a real contact action without claiming a subscription was saved.
  const email = document.querySelector('#invite-email').value.trim();
  const body = `Please invite me to future studio sales and gatherings.\nMy email: ${email}`;
  location.href = `mailto:keoneo.works@gmail.com?subject=${encodeURIComponent('Studio invites')}&body=${encodeURIComponent(body)}`;
  inviteForm.querySelector('.form-status').textContent='Your email draft is ready. Send it to request an invite.';
});
const commentForm = document.querySelector('#comment-form');
if (commentForm) {
  const piece = repositoryPieces.find(item => item.id === Number(params.get('id'))) || repositoryPieces[0];
  document.title = `${piece.title} — Keo Neo`;
  document.querySelectorAll('[data-piece-title]').forEach(element => { element.textContent=piece.title; });
  document.querySelector('.breadcrumb a').href=`repository.html?${new URLSearchParams({view,filter:category})}`;
  const key = `keoneo-comments-${piece.id}`;
  let comments=[];
  try { comments=JSON.parse(localStorage.getItem(key) || '[]'); if(!Array.isArray(comments)) comments=[]; } catch {}
  function addComment(comment) {
    if(!comment || typeof comment.text !== 'string') return;
    const row=document.createElement('p');
    const text=document.createElement('span'); text.textContent=comment.text;
    const time=document.createElement('time');
    const date=new Date(comment.date); if(!Number.isNaN(date.getTime())) { time.dateTime=date.toISOString(); time.textContent=date.toLocaleString('en-US',{timeZone:'America/New_York',month:'2-digit',day:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}); }
    row.append(text,time); document.querySelector('#comment-list').append(row);
  }
  comments.forEach(addComment);
  commentForm.addEventListener('submit',event => {
    event.preventDefault();
    const input=document.querySelector('#comment-text'); const text=input.value.trim();
    if(!text) { input.setCustomValidity('Please enter a comment.'); input.reportValidity(); return; }
    input.setCustomValidity('');
    const comment={text,date:new Date().toISOString()}; comments.push(comment); addComment(comment);
    let saved=false; try { localStorage.setItem(key,JSON.stringify(comments)); saved=true; } catch {}
    input.value=''; commentForm.querySelector('.form-status').textContent=saved ? 'Saved on this browser for the prototype.' : 'Added for this preview session.';
  });
  document.querySelector('#comment-text').addEventListener('input',event => event.target.setCustomValidity(''));
  buildPieceMedia(piece);
}

function buildPieceMedia(piece) {
 const requested=Number(params.get('image'));
 const initial=Number.isInteger(requested) && requested>=0 && requested<3 ? requested : 0;
 const gallery=document.createElement('dialog'); gallery.className='quick-gallery';
 gallery.setAttribute('aria-label',`${piece.title} image gallery`);
 const close=document.createElement('button'); close.type='button'; close.className='gallery-close';close.textContent='Close';
 const scroll=document.createElement('div'); scroll.className='gallery-scroll';scroll.tabIndex=0;
 scroll.setAttribute('aria-label','Swipe up or down to browse the images');
 const minimap=document.createElement('nav');minimap.className='gallery-minimap';minimap.setAttribute('aria-label','Gallery image map');
 const status=document.createElement('p');status.className='visually-hidden';status.setAttribute('role','status');
 let active=0;let measuredHeight=0;let origin;let savedScroll=0;
 const thumbnails=[];const slides=[];
 function syncGallery() {
  const height=slides[0].getBoundingClientRect().height;
  if(!height || measuredHeight && Math.abs(height-measuredHeight)>1) return;
  measuredHeight=height;
  active=Math.max(0,Math.min(piece.images.length-1,Math.round(scroll.scrollTop/height)));
  thumbnails.forEach((button,index)=>{
   button.setAttribute('aria-current',String(index===active));
   button.setAttribute('aria-label',`Image ${index+1} of ${piece.images.length}: ${piece.images[index].alt}${index===active ? ', current image' : ''}`);
  });
  const message=`Image ${active+1} of ${piece.images.length}`;
  if(status.textContent!==message) status.textContent=message;
 }
 function selectImage(index,smooth=true) {
  const clamped=Math.max(0,Math.min(piece.images.length-1,index));
  if(!smooth) { active=clamped; measuredHeight=slides[0].getBoundingClientRect().height; }
  scroll.scrollTo({top:slides[clamped].offsetTop,behavior:smooth && !prefersReducedMotion() ? 'smooth' : 'instant'});
  if(!smooth) syncGallery();
 }
 piece.images.forEach((item,index)=>{
  const slide=document.createElement('figure');slide.className='gallery-image';slide.append(imageElement(item,{eager:index===0}));
  scroll.append(slide);slides.push(slide);
  const thumb=document.createElement('button');thumb.type='button';thumb.setAttribute('aria-current',String(index===0));
  thumb.setAttribute('aria-label',`Image ${index+1} of ${piece.images.length}: ${item.alt}`);
  thumb.append(imageElement(item,{thumbnail:true,eager:true}));thumb.addEventListener('click',()=>selectImage(index));
  minimap.append(thumb);thumbnails.push(thumb);
 });
 gallery.append(scroll,minimap,close,status);document.body.append(gallery);
 function openGallery(index,trigger) {
  origin=trigger;savedScroll=window.scrollY;
  document.body.style.setProperty('--gallery-scroll-offset',`${-savedScroll}px`);
  document.body.classList.add('gallery-open');
  gallery.showModal();
  selectImage(index,false);close.focus({preventScroll:true});
 }
 close.addEventListener('click',()=>gallery.close());
 gallery.addEventListener('close',()=>{
  document.body.classList.remove('gallery-open');document.body.style.removeProperty('--gallery-scroll-offset');
  window.scrollTo(0,savedScroll);origin?.focus({preventScroll:true});
 });
 scroll.addEventListener('scroll',syncGallery,{passive:true});
 gallery.addEventListener('keydown',event=>{
  if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key)) {
   event.preventDefault();
   selectImage(event.key==='Home' ? 0 : event.key==='End' ? piece.images.length-1 : active+(['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1));
  }
 });
 const resize=new ResizeObserver(()=>{if(gallery.open) selectImage(active,false);});resize.observe(scroll);
 const hero=createCarousel(piece.images.slice(0,3),{label:piece.title,onOpen:openGallery,eager:true,initial});
 document.querySelector('.piece-hero').append(hero);
 document.querySelectorAll('[data-gallery-image]').forEach(button=>{
  const index=Number(button.dataset.galleryImage);
  button.setAttribute('aria-label',`Open gallery at image ${index+1}: ${piece.images[index].alt}`);
  button.append(imageElement(piece.images[index]));
  button.addEventListener('click',()=>openGallery(index,button));
 });
}
