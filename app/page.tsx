"use client";
import { useRef, useState } from 'react';
import { FileText, Code2, Play, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { VideoGallery } from '@/components/video-gallery';
import { galleryVideos } from '@/lib/gallery-data';
import { authors, affiliations, citation, arxivUrl, arxivPdfUrl } from '@/lib/publication';
const youtube = 'https://youtu.be/GE_GassSkYM';
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (path: string) => `${base}/assets/${path}`;
export default function Home() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyCitation = async () => {
    try { await navigator.clipboard.writeText(citation); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  };
  const hero = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [heroStarted, setHeroStarted] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const teaserFrames = [
    { image: 'teaser-covered.jpg', label: 'Camera covered' },
    { image: 'teaser-restored.jpg', label: 'Perception restored' },
    { image: 'teaser-crossing.jpg', label: 'Cross the gap' },
  ];
  const stages = [{ label: 'Camera covered', at: 0 }, { label: 'Perception restored', at: 3.5 }, { label: 'Continue traversing', at: 7 }];
  const stage = time < 3.5 ? 0 : time < 7 ? 1 : 2;
  const seek = async (at: number) => {
    const video = hero.current;
    if (!video) return;
    setHeroError(false);
    try {
      video.currentTime = at;
      await video.play();
      setHeroStarted(true);
      video.focus({ preventScroll: true });
    } catch { setHeroError(true); }
  };
  return <>
    <a className="skip-link" href="#overview">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="#overview" aria-label="CAP home">CAP</a><nav aria-label="Main navigation"><a href="#overview">Overview</a><a href="#experiments">Experiments</a><a href="#method">Method</a><a href="#citation">Citation</a></nav></header>
    <main id="overview" onPlayCapture={event => { document.querySelectorAll('video').forEach(video => { if (video !== event.target) video.pause(); }); }}>
      <section className="hero-intro container">
        <p className="eyebrow">CoRL 2026 <span>·</span> Humanoid locomotion</p>
        <h1><span className="title-cap">CAP</span><span className="title-long">Continuously Adaptive Perception-Blind<br className="desktop-break"/> Humanoid Locomotion via Learned Denoising</span></h1>
        <div className="paper-authorship" aria-label="Authors and affiliations">
          <ul className="author-list">{authors.map(author => <li key={author.name}>{author.name}<sup>{author.affiliations}</sup></li>)}</ul>
          <ul className="affiliation-list">{affiliations.map((name, index) => <li key={name}><sup>{index + 1}</sup>{name}</li>)}</ul>
          <p className="corresponding-author">* Corresponding author</p>
        </div>
        <div className="institution-logos" aria-label="Fudan University and TARS Robotics">
          <img src={asset('fudan-logo.png')} alt="Fudan University" width={427} height={148}/>
          <img src={asset('tars-logo.svg')} alt="TARS Robotics" width={473} height={126}/>
        </div>
        <p className="publication-note">Conference on Robot Learning (CoRL) 2026</p>
        <div className="paper-links"><a href={arxivUrl} target="_blank" rel="noreferrer"><FileText size={17}/> arXiv <ArrowUpRight size={14}/></a><a href="https://github.com/Hoshi-No-Ai/CAP" target="_blank" rel="noreferrer"><Code2 size={18}/> GitHub <span className="link-detail">Code coming soon</span><ArrowUpRight size={14}/></a><a href={youtube} target="_blank" rel="noreferrer" className="youtube-link"><Play size={17} fill="currentColor"/> YouTube <ArrowUpRight size={14}/></a></div>
      </section>
      <section className="hero-demo container" aria-label="Cover and uncover demonstration">
        <div className="hero-video-wrap"><video ref={hero} className="hero-video" src={asset('hero.mp4')} poster={asset('hero.jpg')} controls={heroStarted} tabIndex={heroStarted ? 0 : -1} muted playsInline loop preload="metadata" onTimeUpdate={e => setTime(e.currentTarget.currentTime)} aria-label="G1 climbs stairs with its camera covered, regains perception and crosses the gap"><track kind="captions" src={asset('hero.vtt')} srcLang="en" label="Experiment descriptions"/></video>
          {!heroStarted && <button className="hero-teaser" type="button" onClick={() => void seek(0)} aria-label="Play the 12-second demonstration: camera covered, perception restored, and crossing the gap">
            <span className="teaser-panels">{teaserFrames.map((frame, i) => <span className="teaser-panel" key={frame.image}>
              <img src={asset(frame.image)} alt="" width={640} height={1080} fetchPriority={i === 0 ? 'high' : 'auto'}/>
              <span className="teaser-label"><span className="teaser-number">0{i + 1}</span><span>{frame.label}</span></span>
            </span>)}</span>
            <span className="teaser-play"><Play size={19} fill="currentColor"/><span>Watch the sequence <span className="teaser-duration">· 12 sec</span></span></span>
          </button>}
          {heroStarted && <span className="video-status"><i/>{stages[stage].label}</span>}
        </div>
        {heroError && <p className="hero-play-error" role="alert">Playback could not start. Please try again or <a href={asset('hero.mp4')}>open the video</a>.</p>}
        <div className="timeline" aria-label="Video chapters">{stages.map((s, i) => <button key={s.label} className={heroStarted && i <= stage ? 'timeline-step active' : 'timeline-step'} onClick={() => seek(s.at)} aria-current={heroStarted && i === stage ? 'step' : undefined}><span className="timeline-dot"/><span>{s.label}</span></button>)}</div>
        <p className="hero-caption">One policy. Continuous adaptation through perception loss and recovery.</p>
      </section>
      <section className="intro-copy container section" aria-label="Research overview">
        <figure className="paper-teaser"><a href={asset('paper-teaser.webp')} target="_blank" rel="noreferrer" aria-label="View the paper teaser at full resolution"><img src={asset('paper-teaser.webp')} width={2400} height={1148} loading="lazy" alt="CAP paper teaser: (a) a humanoid ascends stairs with its camera covered, then crosses a gap and descends after uncovering; (b) partial camera occlusion examples with raw depth in red frames and world-model reconstructions in green frames; (c) outdoor deployment on grass and stairs."/></a></figure><div className="paper-abstract" id="abstract"><h2>Abstract</h2><p>Humanoid locomotion across complex terrain demands forward-looking exteroception to anticipate obstacles, yet this signal is unreliable in real-world deployment, failing partially and intermittently. Existing perceptive policies often assume that depth observations remain clean and in-distribution, while recent attempts to unify perceptive and blind control typically route or switch between separate sub-policies, leaving recoverable information in partially corrupted depth unexploited. We instead propose CAP, a single-stage humanoid locomotion policy that recovers this signal with a perceptive world-model encoder trained as a learned denoiser to reconstruct clean depth from a corrupted input, together with a co-active proprioceptive variational encoder that supplies depth-free body-state information. A coupled training recipe pairs a depth-noise curriculum on the world-model input with world-model feature dropout on the policy-facing latent, exposing the policy to failures across the entire perception-quality spectrum. In simulation, CAP matches or improves upon perceptive baselines when depth remains informative, and degrades more smoothly than a binary-switching baseline as perception worsens. On the Unitree G1, controlled trials and indoor–outdoor deployments demonstrate perception-robust locomotion under intermittent occlusion, real-sensor corruption, and outdoor depth artifacts.</p></div></section>
      <section id="experiments" className="container section">
        <div className="section-heading"><p className="eyebrow">On the real robot</p><h2>From the lab to the outdoors.</h2><p>Perception-robust locomotion on the Unitree G1.</p></div>
        <VideoGallery id="clean-perception" number="01" title="Locomotion with clean perception" description="Stairs and mixed terrain under normal sensing." videos={['clip-02','clip-06','clip-03','clip-07','clip-08'].map(id => galleryVideos[id])}/>
        <VideoGallery id="perception-failures" number="02" title="Robustness to perception failures" description="Partial occlusion, complete camera cover, and changing perception." videos={['clip-04','clip-09','clip-10','clip-01','clip-05'].map(id => galleryVideos[id])}/>
        <VideoGallery id="outdoor-deployment" number="03" title="Beyond the laboratory" description="Grass slopes, long staircases, platforms, and more outdoor stair views." videos={['clip-11','clip-12','clip-15','clip-16','clip-19'].map(id => galleryVideos[id])}/>
      </section>
      <section id="method" className="container section">
        <div className="section-heading"><p className="eyebrow">The method</p><h2>Two complementary pathways.<br/>One locomotion policy.</h2><p>A denoising perceptive pathway and a depth-free proprioceptive pathway remain co-active.</p></div>
        <a className="figure-link" href={asset('framework.png')} target="_blank" rel="noreferrer" aria-label="Open the CAP framework figure at full resolution"><img className="framework-figure" src={asset('framework.png')} alt="CAP framework from the paper: a perceptive world-model encoder and proprioceptive VAE feed a shared-gate mixture-of-experts actor-critic, with coupled depth corruption and world-model feature dropout." loading="lazy"/><span>View full resolution <ArrowUpRight size={15}/></span></a>
        <div className="method-grid"><article><span className="method-number">01 / PERCEPTION</span><h3>Learn to denoise.</h3><p>The world model reconstructs a clean, stabilized depth target from corrupted observations, learning to recover useful terrain structure.</p></article><article><span className="method-number">02 / PROPRIOCEPTION</span><h3>Stay grounded in body state.</h3><p>A high-rate proprioceptive VAE supplies depth-free body-state information alongside the perceptive pathway.</p></article><article><span className="method-number">03 / TRAINING</span><h3>Train across perception quality.</h3><p>A depth-noise curriculum and world-model feature dropout expose the policy to both input corruption and unreliable perceptive features.</p></article></div>
      </section>
      <section id="results" className="container section results-section">
        <div className="section-heading"><p className="eyebrow">Evidence from the paper</p><h2>Gradual degradation.<br/>Continuous adaptation.</h2><p>Simulation sweeps and controlled hardware trials evaluate changing perception quality.</p></div>
        <div className="results-layout"><figure className="result-figure"><a href={asset('degradation.png')} target="_blank" rel="noreferrer" aria-label="Open perception-quality sweep at full resolution"><img src={asset('degradation.png')} loading="lazy" alt="Paper Figure 4: success rates across eight stages of perception degradation for CAP and baseline policies, on perception-required terrains and stairs."/></a><figcaption>Perception-quality sweep from the paper. CAP degrades more smoothly than the binary-switching baseline.</figcaption></figure>
          <div className="hardware-results"><p className="eyebrow">Controlled real-world trials</p><h3>Performance across<br/>perception conditions.</h3><div className="result-stat"><strong>39<span>/40</span></strong><p>successful trials under clean<br/>and partially occluded perception</p></div>
          <Table className="results-table"><TableCaption>5 trials per terrain and condition. Results from the camera-ready manuscript.</TableCaption><TableHeader><TableRow><TableHead scope="col">Perception</TableHead><TableHead scope="col">Stair</TableHead><TableHead scope="col">Platform</TableHead><TableHead scope="col">Gap</TableHead><TableHead scope="col">Mixed</TableHead></TableRow></TableHeader><TableBody>{[
            ['Clean','5/5','5/5','5/5','5/5'],['Partial occlusion','5/5','4/5','5/5','5/5'],['Full cover','5/5','0/5','0/5','0/5'],
          ].map(row => <TableRow key={row[0]}><TableHead scope="row">{row[0]}</TableHead>{row.slice(1).map((v,i) => <TableCell key={i}>{v}</TableCell>)}</TableRow>)}</TableBody></Table>
          <p className="small-note result-limit">Complete perception loss remains a limitation on terrain that requires forward-looking depth, such as gaps and platforms.</p></div></div>
      </section>
      <section id="full-video" className="youtube-resource container"><div><span className="youtube-mark"><Play size={21} fill="currentColor"/></span><div><h3>Watch the full demonstration.</h3><p>All experiments in the complete project video.</p></div></div><a href={youtube} target="_blank" rel="noreferrer">Watch on YouTube <ArrowUpRight size={17}/></a></section>
      <section className="paper-section container"><div><p className="eyebrow">Read the paper</p><h2>Explore CAP in detail.</h2><p>Architecture, training, evaluations, and limitations.</p></div><a className="paper-download" href={arxivPdfUrl} target="_blank" rel="noreferrer"><FileText size={20}/><span>Read the paper<small>PDF · arXiv:2609.11553</small></span><ArrowUpRight size={20}/></a></section>
      <section id="citation" className="citation-section container" aria-labelledby="citation-title">
        <div className="citation-heading"><div><p className="eyebrow">Reference</p><h2 id="citation-title">Citation</h2></div><div className="citation-actions"><a href={asset('cap.bib')} download>Download .bib</a><button type="button" onClick={() => void copyCitation()}>{copyStatus === 'copied' ? <Check size={16}/> : <Copy size={16}/>} {copyStatus === 'copied' ? 'Copied' : 'Copy BibTeX'}</button></div></div>
        <pre className="citation-code"><code>{citation}</code></pre>
        <p className="citation-feedback" role="status">{copyStatus === 'error' ? 'Copy unavailable. Select the citation above or download the .bib file.' : copyStatus === 'copied' ? 'BibTeX copied to clipboard.' : ''}</p>
      </section>
    </main><footer className="container"><a className="wordmark" href="#overview">CAP</a><p>Continuously Adaptive Perception-Blind Humanoid Locomotion</p><a href="#overview">Back to top ↑</a></footer>
  </>;
}
