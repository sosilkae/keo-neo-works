// A single-item preview: the archive and every other PDP keep their existing data/layout.
(() => {
 if (Number(new URLSearchParams(location.search).get('id')) !== 1) return;
 document.documentElement.classList.add('pdp-v2');
 const asset = name => `images/pdp-preview/${name}`;
 const artwork = (layout, file, alt) => ({layout, src:asset(file), alt});
 const images = [
  artwork('scene','piece.png','Challace 1892 with a persimmon, in the studio'),
  artwork('rust','process-carousel.png','A hand reaching towards the ceramic collection'),
  artwork('collection','collection.png','Challace cups arranged together on a table'),
  artwork('dark','empty-piece.png','The dark glazed Challace cup, without a persimmon'),
  artwork('pink','persimmon-photo.png','Challace 1892 holding a persimmon, against a pale background'),
  artwork('detail','piece.png','A closer look at the dark glaze and foot of Challace 1892'),
  artwork('studio','studio-photo.png','The footed ceramic piece held in a hand at the studio'),
  artwork('company','company.png','Challace 1892 photographed in a lived-in interior'),
 ];
 function renderImage(item, {eager=false}={}) {
  const wrap=document.createElement('span'); wrap.className=`v2-artwork v2-artwork-${item.layout}`;
  const canvas=document.createElement('span'); canvas.className='v2-artboard';
  function image(src, alt, className) {
   const img=document.createElement('img'); img.src=src; img.alt=alt; img.className=className;
   img.loading=eager ? 'eager' : 'lazy'; img.decoding='async'; img.draggable=false;
   return img;
  }
  if(item.layout==='scene') {
   const mask=document.createElement('span');mask.className='v2-scene-mask';
   const background=document.createElement('span');background.className='v2-scene-background';
   background.append(image(asset('scene.png'),'','v2-scene-photo'));mask.append(background);canvas.append(mask);
  }
  const slot=document.createElement('span'); slot.className='v2-art-slot';
  slot.append(image(item.src,item.alt,'v2-art-photo')); canvas.append(slot);wrap.append(canvas);return wrap;
 }
 window.pdpPreview={id:1,title:'Challace 1892',type:'Challace Cup',dimensions:'H3.5” by W1.5”',images,heroCount:5,renderImage,onSlideChange:index=>{document.documentElement.dataset.heroTone=[1,3].includes(index)?'dark':'light';}};
 const main=document.querySelector('.piece-main');
 const hero=document.querySelector('.piece-hero');
 const breadcrumb=document.querySelector('.breadcrumb');
 const comments=document.querySelector('.comments');
 const interest=document.querySelector('.piece-interest');
 breadcrumb.querySelector('img').src=asset('back.svg');
 breadcrumb.insertBefore(breadcrumb.querySelector('img'),breadcrumb.firstChild);
 const separator=document.createElement('span');separator.className='v2-breadcrumb-dot';separator.setAttribute('aria-hidden','true');
 breadcrumb.insertBefore(separator,breadcrumb.querySelector('[data-piece-title]'));
 const flow=document.createElement('div');flow.className='v2-content';
 flow.innerHTML=`
  <section class="piece-info v2-group" aria-labelledby="piece-title">
   <div class="v2-title-row"><h1 id="piece-title" data-piece-title>Challace 1892</h1><span class="v2-edition">1 <em>of</em> 1</span></div>
   <div class="v2-metadata"><p data-piece-type>Challace Cup</p><p class="v2-caption" data-piece-dimensions>H3.5” by W1.5”</p></div>
   <p>Lorem ipsum dolar ulna nor orem ipsum dolar ulna nor lorem ipsum dolar ulna nor orem ipsum dolar ulna nor lorem ipsum dolar ulna nor.</p>
   <ul><li>Stoneware</li><li>Food safe</li><li>Dishwasher safe</li></ul>
   <button class="v2-subscribe-link" type="button" aria-haspopup="dialog">Subscribe for the next Private Studio Sale</button>
  </section>
  <section class="v2-section" aria-labelledby="detail-title"><h2 id="detail-title" class="v2-inset">A closer look</h2><button type="button" class="v2-detail v2-media-button" data-gallery-image="5"></button></section>
  <section class="v2-section v2-inset" aria-labelledby="process-title"><h2 id="process-title">Process</h2><p>From the first study to the final surface: notes on form, material, and the choices that shaped this piece.</p><button class="v2-text-button" id="process-more" type="button" aria-expanded="false" aria-controls="process-notes">Read more +</button><p id="process-notes" hidden>More of the story will be shared alongside the studio sale. Join the list for thoughts, research, and updates from the studio.</p></section>
  <section class="v2-section v2-field-notes v2-inset" aria-labelledby="field-title"><h2 id="field-title">Field notes</h2><div class="v2-paragraphs"><p>An ongoing collection of references, sketches, and questions behind this piece.</p><p>More thoughts and research from the studio, as the work unfolds.</p></div></section>
  <figure class="v2-studio"><button type="button" class="v2-studio-photo v2-media-button" data-gallery-image="6"></button><figcaption class="v2-inset v2-caption">At the studio.</figcaption></figure>
  <section class="v2-section" aria-labelledby="faq-title"><h2 id="faq-title" class="v2-inset">Common Questions</h2><div class="v2-faq-track" tabindex="0" aria-label="Common questions; swipe to browse">
   <article class="v2-faq-card"><h3>Is each piece unique?</h3><p>Each object has its own studio notes. Details about its edition and availability will be shared before a sale.</p></article>
   <article class="v2-faq-card"><h3>How should I care for it?</h3><p>Care notes will accompany each piece, with guidance for its material, surface, and everyday use.</p></article>
   <article class="v2-faq-card"><h3>How do studio sales work?</h3><p>Join the studio list for early notice of private sales, pop-ups, and pieces looking for a new home.</p></article>
  </div><div class="v2-faq-controls"><div class="v2-faq-dots" role="group" aria-label="Choose a question"><button type="button" aria-label="Question 1" aria-pressed="true"></button><button type="button" aria-label="Question 2" aria-pressed="false"></button><button type="button" aria-label="Question 3" aria-pressed="false"></button></div><button type="button" class="v2-text-button" id="more-faqs" aria-expanded="false" aria-controls="all-faqs">More FAQs</button></div><div id="all-faqs" class="v2-inset v2-all-faqs" hidden></div></section>
  <section class="v2-section" aria-labelledby="related-title"><h2 id="related-title" class="v2-inset">Related objects</h2><div class="v2-related-track" aria-label="Related objects"></div></section>
  <section class="v2-section" aria-labelledby="company-title"><h2 id="company-title" class="v2-inset">In good company</h2><figure class="v2-company"><button type="button" class="v2-company-photo v2-media-button" data-gallery-image="7"></button><figcaption class="v2-inset v2-caption">At the studio, before a new home.</figcaption></figure></section>`;
 flow.append(comments,interest);
 main.replaceChildren(breadcrumb,hero,flow);
 interest.querySelector('.primary-button').textContent='Leave a comment';
 document.querySelector('.studio-play img').src=asset('studio-play.svg');
 document.querySelector('.studio-status').src=asset('studio-status.svg');
 const query=new URLSearchParams(location.search);
 const related=[{id:4,layout:'olive',file:'related-olive.png'},{id:6,layout:'gold',file:'related-gold.png'},{id:5,layout:'charcoal',file:'related-charcoal.png'}];
 related.forEach(item=>{
  const link=document.createElement('a');link.className='v2-related-card';
  link.href=`piece.html?${new URLSearchParams({id:item.id,view:query.get('view')||'list',filter:query.get('filter')||'All',image:0})}`;
  link.setAttribute('aria-label','OM CUP, $80. View piece');
  link.append(renderImage(artwork(item.layout,item.file,'A related handmade ceramic cup')));
  const name=document.createElement('span');name.className='v2-related-name';name.textContent='OM CUP';
  const price=document.createElement('span');price.className='v2-related-price';price.textContent='$80';link.append(name,price);
  document.querySelector('.v2-related-track').append(link);
 });
 const faqTrack=document.querySelector('.v2-faq-track');
 const faqCards=[...faqTrack.children];const dots=[...document.querySelectorAll('.v2-faq-dots button')];
 function showQuestion(index){faqTrack.scrollTo({left:faqCards[index].offsetLeft-faqCards[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 dots.forEach((dot,index)=>dot.addEventListener('click',()=>showQuestion(index)));
 faqTrack.addEventListener('scroll',()=>{const step=faqCards[1].offsetLeft-faqCards[0].offsetLeft;const active=Math.round(faqTrack.scrollLeft/step);dots.forEach((dot,index)=>dot.setAttribute('aria-pressed',String(index===active)));},{passive:true});
 faqTrack.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const current=dots.findIndex(dot=>dot.getAttribute('aria-pressed')==='true');showQuestion(Math.max(0,Math.min(2,current+(event.key==='ArrowRight'?1:-1))));}});
 const allFaqs=document.querySelector('#all-faqs');
 faqCards.forEach(card=>allFaqs.append(card.cloneNode(true)));
 for(const [buttonId,contentId,label] of [['process-more','process-notes','Read more'],['more-faqs','all-faqs','More FAQs']]) {
  const button=document.getElementById(buttonId),content=document.getElementById(contentId);
  button.addEventListener('click',()=>{content.hidden=!content.hidden;button.setAttribute('aria-expanded',String(!content.hidden));button.textContent=content.hidden?(buttonId==='process-more'?'Read more +':label):(buttonId==='process-more'?'Read less −':'Fewer FAQs');});
 }
 const dialog=document.createElement('dialog');dialog.className='v2-signup-dialog';dialog.setAttribute('aria-labelledby','signup-title');
 dialog.innerHTML=`<div class="v2-signup-sheet"><div class="v2-sheet-handle" aria-hidden="true"></div><div class="v2-sheet-header"><p>STUDIO NOTES</p><button class="v2-sheet-close" type="button" aria-label="Close signup">×</button></div><div class="v2-sheet-piece"><div class="v2-sheet-thumbnail"></div><div><p>Challace 1892</p><p class="v2-caption">Challace Cup · 1 of 1</p></div></div><div id="signup-intro" class="v2-signup-intro"><h2 id="signup-title">Stay close to Challace 1892</h2><p>Thanks for spending time with this piece. Leave your email for a note if it finds a new home, plus invitations to private studio sales, special pop-ups, and occasional thoughts and research behind new work.</p></div><form id="piece-signup"><label for="signup-email">Email address</label><input id="signup-email" type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254" placeholder="you@example.com"><button class="v2-primary-button" type="submit">Keep me in the loop</button></form><div id="signup-confirmation" hidden><h2>You’re on the list.</h2><p>Thanks for being here. Your interest in Challace 1892 is noted. I’ll be in touch with studio notes, private sales, and news when pieces are ready for a new home.</p><button type="button" class="v2-primary-button v2-sheet-done">Back to the piece</button></div><p class="v2-signup-footer">Occasional notes from the studio.<br>Unsubscribe whenever you like.<span class="v2-prototype-note">Prototype only — no subscription is sent.</span></p></div>`;
 dialog.querySelector('.v2-sheet-thumbnail').append(renderImage(images[0],{eager:true}));
 document.body.append(dialog);
 let signupOrigin, signupScroll=0, closeTimer;
 function openSignup(event){
  signupOrigin=event.currentTarget;signupScroll=scrollY;
  document.body.style.setProperty('--signup-scroll-offset',`${-signupScroll}px`);document.body.classList.add('sheet-open');
  dialog.classList.remove('is-closing');dialog.querySelector('#signup-intro').hidden=false;dialog.querySelector('form').hidden=false;dialog.querySelector('#signup-confirmation').hidden=true;
  dialog.querySelector('.v2-signup-footer').firstChild.textContent='Occasional notes from the studio.';
  dialog.showModal();dialog.querySelector('.v2-sheet-close').focus({preventScroll:true});
 }
 function closeSignup(){
  if(!dialog.open||dialog.classList.contains('is-closing'))return;
  dialog.classList.add('is-closing');
  closeTimer=setTimeout(()=>dialog.close(),matchMedia('(prefers-reduced-motion: reduce)').matches?0:200);
 }
 document.querySelector('.v2-subscribe-link').addEventListener('click',openSignup);
 dialog.querySelectorAll('.v2-sheet-close,.v2-sheet-done').forEach(button=>button.addEventListener('click',closeSignup));
 dialog.addEventListener('click',event=>{if(event.target===dialog)closeSignup();});
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeSignup();});
 dialog.addEventListener('close',()=>{clearTimeout(closeTimer);document.body.classList.remove('sheet-open');document.body.style.removeProperty('--signup-scroll-offset');window.scrollTo(0,signupScroll);signupOrigin?.focus({preventScroll:true});dialog.querySelector('form').reset();});
 const handle=dialog.querySelector('.v2-sheet-handle');let dragY;
 handle.addEventListener('pointerdown',event=>{dragY=event.clientY;handle.setPointerCapture(event.pointerId);});
 handle.addEventListener('pointerup',event=>{if(dragY!==undefined&&event.clientY-dragY>50)closeSignup();dragY=undefined;});
 dialog.querySelector('form').addEventListener('submit',event=>{
  event.preventDefault();dialog.querySelector('#signup-intro').hidden=true;dialog.querySelector('form').hidden=true;dialog.querySelector('#signup-confirmation').hidden=false;
  const heading=dialog.querySelector('#signup-confirmation h2');heading.id='signup-success-title';dialog.setAttribute('aria-labelledby',heading.id);heading.tabIndex=-1;heading.focus({preventScroll:true});
 });
 dialog.addEventListener('close',()=>dialog.setAttribute('aria-labelledby','signup-title'));
})();
