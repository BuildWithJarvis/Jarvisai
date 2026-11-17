import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup
  getRedirectResult,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";
const firebaseConfig = {
apiKey: "AIzaSyA8G_o4VGKX3XYTLBNgaML20r-S6ukXdIc",
authDomain: "jarvis-ai-96817.firebaseapp.com",
projectId: "jarvis-ai-96817",
storageBucket: "jarvis-ai-96817.firebasestorage.app",
messagingSenderId: "100634280415",
appId: "1:100634280415:web:7f0b4fa9b614f60f0dc46a",
measurementId: "G-6PKTP2V31M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("JARVIS AI Firebase initialized successfully!");

const pages = ['home','chat','write','study','business','saved','settings'];
const pageNames = {home:'Overview',chat:'Ask Jarvis',write:'Write for me',study:'Study helper',business:'Business helper',saved:'Saved items',settings:'Settings'};
const sidebar = document.getElementById('sidebar');
const toast = document.getElementById('toast');

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove('show'),2400);
}
function navigate(page){
  if(!pages.includes(page)) return;
  document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active-page',el.id===`page-${page}`));
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
  document.getElementById('pageCrumb').textContent=pageNames[page];
  sidebar.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-page]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.page)));
document.getElementById('menuBtn').addEventListener('click',()=>sidebar.classList.toggle('open'));
document.getElementById('profileBtn').addEventListener('click',()=>showToast('Profile and accounts will be added in a later version.'));

function addMessage(text,who){
  const wrap=document.createElement('div');
  wrap.className=`message ${who}`;
  const avatar=document.createElement('div'); avatar.className='message-avatar'; avatar.textContent=who==='assistant'?'✦':'J';
  const body=document.createElement('div');
  const sender=document.createElement('span'); sender.className='sender'; sender.textContent=who==='assistant'?'JARVIS':'YOU';
  const p=document.createElement('p'); p.textContent=text;
  body.append(sender,p); wrap.append(avatar,body); document.getElementById('chatMessages').append(wrap);
  wrap.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function demoReply(question){
  const q=question.toLowerCase();
  if(q.includes('jamb')||q.includes('waec')||q.includes('study')) return 'A useful way to begin is to choose one topic, review the key ideas, then answer a few practice questions. Tell me the subject and topic, and we can break it into smaller steps. This is a sample response in prototype mode.';
  if(q.includes('business')||q.includes('sell')||q.includes('customer')) return 'Start by describing who the product helps, what problem it solves, and how people will discover it. Then test the idea with a small group before spending money on promotion. This is a sample response in prototype mode.';
  if(q.includes('write')||q.includes('post')||q.includes('article')) return 'I can help you plan a clear introduction, organise the main points and finish with a useful call to action. Open “Write for me” to try a writing template. This is a sample response in prototype mode.';
  return 'Thanks for your question. The Jarvis chat screen is working, but it is currently using demo responses rather than a live AI model. We can connect a real AI service later through a secure backend.';
}
document.getElementById('chatForm').addEventListener('submit',e=>{
  e.preventDefault(); const input=document.getElementById('chatInput'); const value=input.value.trim();
  if(!value)return; addMessage(value,'user'); input.value='';
  setTimeout(()=>addMessage(demoReply(value),'assistant'),350);
});

const writeSamples={
  social:(topic)=>`Here is a simple post idea about ${topic}:\n\nSmall steps can lead to meaningful progress. Take time to learn, practise and ask questions when you need help. Your journey does not have to look like anyone else's.\n\nWhat is one thing you are working on this week? Share it below.\n\n#Learning #PersonalGrowth`,
  article:(topic)=>`Article outline: ${topic}\n\n1. Introduction — explain the topic and why it matters.\n2. Main point one — introduce the first useful idea.\n3. Main point two — add an example or practical explanation.\n4. Main point three — share common mistakes or helpful tips.\n5. Conclusion — recap the key message and suggest a next step.\n\nResearch facts and add your own examples before publishing.`,
  email:(topic)=>`Subject: ${topic}\n\nHello,\n\nI hope you are doing well. I am writing regarding ${topic}.\n\nI would appreciate the opportunity to discuss this further. Please let me know if you need any additional information.\n\nThank you for your time.\n\nKind regards,`,
  bio:(topic)=>`I am interested in ${topic} and enjoy learning, creating and sharing useful ideas. I value clear communication, curiosity and continuous improvement.`,
  story:(topic)=>`Story starter: ${topic}\n\nA character discovers that the situation they have taken for granted is more complicated than it first appeared. Give the character a clear goal, an obstacle that tests their choices, and a decision that changes what happens next.`
};
document.getElementById('writeBtn').addEventListener('click',()=>{
  const topic=document.getElementById('writePrompt').value.trim(); if(!topic){showToast('Please describe what you want to write.');return;}
  const type=document.getElementById('writeType').value;
  document.getElementById('writeResult').textContent=writeSamples[type](topic);
  document.getElementById('writeOutput').classList.remove('hidden');
});
document.getElementById('copyDraft').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(document.getElementById('writeResult').textContent);showToast('Draft copied.');}
  catch{showToast('Copy is unavailable in this browser.');}
});
document.getElementById('studyBtn').addEventListener('click',()=>{
  const topic=document.getElementById('studyTopic').value.trim(); if(!topic){showToast('Enter a topic first.');return;}
  document.getElementById('studyResult').innerHTML=`<p><strong>Topic:</strong> ${escapeHtml(topic)}</p><ul><li>Write down what you already know about the topic.</li><li>Identify three important terms or ideas.</li><li>Explain each idea in your own words.</li><li>Try practice questions and review any mistakes.</li></ul><p><strong>Study tip:</strong> Use short study sessions and take breaks. This is a study framework, not a subject-specific answer yet.</p>`;
  document.getElementById('studyOutput').classList.remove('hidden');
});
document.getElementById('businessBtn').addEventListener('click',()=>{
  const idea=document.getElementById('businessIdea').value.trim(); if(!idea){showToast('Describe your idea first.');return;}
  document.getElementById('businessResult').innerHTML=`<p><strong>Your idea:</strong> ${escapeHtml(idea)}</p><ul><li><strong>Audience:</strong> Who would benefit most?</li><li><strong>Problem:</strong> What need does it address?</li><li><strong>Offer:</strong> What exactly will customers receive?</li><li><strong>Test:</strong> Ask a few potential customers for feedback before spending money.</li><li><strong>Next step:</strong> Write a one-sentence description of the product or service.</li></ul><p>Keep your first test small and avoid promising results you cannot guarantee.</p>`;
  document.getElementById('businessOutput').classList.remove('hidden');
});
function escapeHtml(str){return str.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}


// Public landing page to demo workspace navigation.
function openJarvisWorkspace(){
  document.getElementById('landingPage').style.display='none';
  document.querySelector('.app-shell').classList.add('hidden-app');

  document.getElementById('authScreen').style.display='flex';
  document.getElementById('signupForm').style.display='block';
  document.getElementById('loginForm').style.display='none';

  window.scrollTo({top:0,behavior:'smooth'});
}
['landingOpenBtn','heroOpenBtn','bottomOpenBtn'].forEach(id=>{
  const button=document.getElementById(id);
  if(button) button.addEventListener('click',openJarvisWorkspace);
});

// JARVIS AI Authentication

const googleProvider = new GoogleAuthProvider();

function showAuthMessage(message) {
  document.getElementById('authMessage').textContent = message;
}

function showWorkspace() {
  document.getElementById('landingPage').style.display = 'none';
  document.getElementById('authScreen').style.display = 'none';
  document.querySelector('.app-shell').classList.remove('hidden-app');
  navigate('home');
}

function showLoginScreen() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  showAuthMessage('');
}

function showSignupScreen() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
  showAuthMessage('');
}

// Landing page buttons
document.getElementById('loginBtn').addEventListener('click', () => {
  document.getElementById('landingPage').style.display = 'none';
  showLoginScreen();
});

document.getElementById('signupBtn').addEventListener('click', () => {
  document.getElementById('landingPage').style.display = 'none';
  showSignupScreen();
});

// Switch between forms
document.getElementById('showLogin').addEventListener('click', showLoginScreen);
document.getElementById('showSignup').addEventListener('click', showSignupScreen);

// Return to landing page
document.getElementById('backToLanding').addEventListener('click', () => {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('landingPage').style.display = 'block';
  showAuthMessage('');
});

// Email registration
document.getElementById('signupSubmit').addEventListener('click', async () => {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    showAuthMessage('Please complete all fields.');
    return;
  }

  if (password.length < 6) {
    showAuthMessage('Password must contain at least 6 characters.');
    return;
  }

  try {
    showAuthMessage('Creating your account...');

    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, {
      displayName: name
    });

    showWorkspace();
  } catch (error) {
    showAuthMessage(error.message);
  }
});

// Email login
document.getElementById('loginSubmit').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAuthMessage('Enter your email and password.');
    return;
  }

  try {
    showAuthMessage('Logging in...');

    await signInWithEmailAndPassword(auth, email, password);

    showWorkspace();
  } catch (error) {
    showAuthMessage(error.message);
  }
});

// Google sign-in
async function googleLogin() {
  try {
    showAuthMessage('Opening Google sign-in...');

    const result = await signInWithPopup(auth, googleProvider);

    if (result.user) {
      showWorkspace();
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    showAuthMessage(error.message);
  }
}

document.getElementById('googleSignup').addEventListener('click', googleLogin);
document.getElementById('googleLogin').addEventListener('click', googleLogin);

// Check Google sign-in after redirect
getRedirectResult(auth)
  .then(result => {
    if (result && result.user) {
      showWorkspace();
    }
  })
  .catch(error => {
    console.error('Google sign-in error:', error);
    showAuthMessage(error.message);
  });

// Monitor signed-in users
onAuthStateChanged(auth, user => {
  if (user) {
    showAuthMessage('Signed in as: ' + user.email);
    showWorkspace();
  } else {
    showAuthMessage('Firebase says: No signed-in user.');
  }
});
// JARVIS AI Logout
const logoutButton = document.getElementById('logoutBtn');

if (logoutButton) {
logoutButton.addEventListener('click', async () => {
    alert('Logout button is working!');
    try {
      await signOut(auth);

      document.querySelector('.app-shell').classList.add('hidden-app');
      document.getElementById('authScreen').style.display = 'none';
      document.getElementById('landingPage').style.display = 'block';

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Logout failed:', error);
      showAuthMessage('Unable to log out. Please try again.');
    }
  });
}