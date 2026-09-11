"use client";

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

export type GalleryVideo = { id: string; title: string; condition: string; duration: string; portrait?: boolean; hasDepthOverlay?: boolean };
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const media = (id: string, ext: string) => `${base}/assets/gallery/${id}.${ext}`;

function VideoCard({ item, visible }: { item: GalleryVideo; visible: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (!visible) video.current?.pause(); }, [visible]);
  const activate = () => {
    if (!video.current) return;
    video.current.src = media(item.id, 'mp4');
    setLoaded(true);
    void video.current.play().catch(() => { /* Native controls remain available. */ });
  };
  return <article className="gallery-card">
    <div className={`gallery-player${item.portrait ? ' portrait-video' : ''}`}>
      <video ref={video} poster={media(item.id, 'jpg')} controls={loaded} muted playsInline preload="none" aria-label={`${item.title}, ${item.condition}`} tabIndex={visible && loaded ? 0 : -1}/>
      {!loaded && <button type="button" className="gallery-play" aria-label={`Play ${item.title}, ${item.condition}`} onClick={activate} tabIndex={visible ? 0 : -1}><span><Play size={21} fill="currentColor"/></span></button>}
      <span className="gallery-duration">{item.duration}</span>
    </div>
    <div className="gallery-meta"><h4>{item.title}</h4><p>{item.condition}</p>
      {item.hasDepthOverlay && <p className="gallery-depth-note">Raw depth + WM reconstruction</p>}
    </div>
  </article>;
}

export function VideoGallery({ id, number, title, description, videos }: { id: string; number: string; title: string; description: string; videos: GalleryVideo[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [visible, setVisible] = useState<number[]>([]);
  useEffect(() => {
    if (!api) return;
    const update = () => setVisible(api.slidesInView());
    update();
    api.on('slidesInView', update); api.on('reInit', update);
    return () => { api.off('slidesInView', update); api.off('reInit', update); };
  }, [api]);
  const active = visible.length ? visible : [0, 1, 2].slice(0, videos.length);
  const first = Math.min(...active) + 1;
  const last = Math.max(...active) + 1;
  return <Carousel id={id} className="video-gallery" setApi={setApi} opts={{ align: 'start', slidesToScroll: 1, containScroll: 'trimSnaps', loop: false, inViewThreshold: 0.5 }} aria-labelledby={`${id}-title`}
    onKeyDownCapture={event => {
      // Keep native video seeking/volume keys inside the video player.
      if ((event.target as HTMLElement).tagName === 'VIDEO') return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); api?.scrollPrev(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); api?.scrollNext(); }
    }}>
    <div className="gallery-heading"><div><h3 id={`${id}-title`}><span>{number}</span>{title}</h3><p>{description}</p></div>
      <div className="gallery-navigation"><span className="gallery-count" aria-live="polite" aria-atomic="true">{first}–{last} <span>/ {videos.length}</span></span><CarouselPrevious aria-label={`Previous videos: ${title}`}/><CarouselNext aria-label={`Next videos: ${title}`}/></div>
    </div>
    <CarouselContent className="video-track">{videos.map((item, index) => <CarouselItem className="gallery-slide" key={item.id} inert={!active.includes(index)} aria-label={`${index + 1} of ${videos.length}: ${item.title}`} onFocusCapture={() => { if (!active.includes(index)) api?.scrollTo(index); }}><VideoCard item={item} visible={active.includes(index)}/></CarouselItem>)}</CarouselContent>
  </Carousel>;
}
