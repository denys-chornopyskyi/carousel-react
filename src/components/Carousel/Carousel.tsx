import {ArrowBigLeft, ArrowBigRight, Circle, CircleDot} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import "./Carousel.css";
import type {settingsProps} from "../../App";
import {wait} from "./utils/timeout.ts";

interface CarouselProps extends settingsProps {
  imageUrls: string[];
}

const Carousel = ({imageUrls, settings, setSettings}: CarouselProps) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [renderQueue, setRenderQueue] = useState<string[]>(
    [imageUrls[imageIndex]])
  const [isTranslated, setIsTranslated] = useState<boolean>(false)


  const currentTarget = useRef<HTMLImageElement>(null)
  const isNeedTranslate = useRef<boolean>(false)


  const showPrevImage = () => {
    setImageIndex((index) => {
      if (index === 0) return imageUrls.length - 1;
      return index - 1;
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setRenderQueue((prevState) => prevState.slice(1))
        setSettings({...settings, animation: false})
        setIsTranslated(false)
        isNeedTranslate.current = false
        observer.disconnect()
      }
    })
  }, {
    threshold: 0
  })


  const showNextImageStrip = () => {
    setImageIndex((index) => {
      if (index === imageUrls.length - 1) return 0;
      return index + 1;
    });

  };

  const showNextImageDeque = () => {
    let i = 0
    setImageIndex((index) => {
      if (index === imageUrls.length - 1) {
        i = index
        return index;
      }
      i = index + 1
      return index + 1;
    });
    setSettings({...settings, animation: true})
    setRenderQueue((prevState) => [...prevState, imageUrls[i]])
    isNeedTranslate.current = true
  }

  useEffect(() => {
      let canceled = false;

      async function loop() {
        while (!canceled && settings.autoReplay) {
          await wait(settings.autoReplayDelay)
          showNextImageStrip()
          if (settings.animation) {
            await wait(settings.animDuration)
          }
        }
      }


      if (isNeedTranslate.current) {
        setIsTranslated(true)
        if (currentTarget.current) observer.observe(currentTarget.current)
      }


      loop()
      return () => {
        canceled = true
      }
    },
    [settings.autoReplay, settings.animation, isNeedTranslate.current])

  return (
    <div style={{position: "relative", width: "640px", height: "auto"}}>
      <div
        style={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        {settings.sliderLogic === 'strip' && imageUrls.map((url) => {
          return <img
            alt={`img-${url}`}
            key={url}
            src={url}
            className="carousel-image"
            style={{
              translate: `${-100 * imageIndex}%`,
              transition: settings.animation ? `translate ${settings.animDuration}ms ${settings.animationCurve}` : ''
            }}
          />
        })}

        {settings.sliderLogic === 'deque' && renderQueue.map((url, index) => (
          <img
            alt={`img-${url}`}
            key={url}
            src={url}
            ref={0 === index ? currentTarget : null}
            // ref={currentTarget}
            className="carousel-image"
            style={{
              translate: isTranslated ? `-101% ` : '0%',
              transition: settings.animation ? `translate ${settings.animDuration}ms ${settings.animationCurve}` : ''
            }}
          />
        ))}
      </div>

      {settings.addControlBtns && (
        <>
          <button
            className="carousel-btn"
            onClick={showPrevImage}
            style={{left: 0}}
          >
            <ArrowBigLeft/>
          </button>
          <button
            className="carousel-btn"
            onClick={settings.sliderLogic === 'strip' ? showNextImageStrip : showNextImageDeque}
            style={{right: 0}}
          >
            <ArrowBigRight/>
          </button>
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: "50%",
          translate: "-50%",
          bottom: ".5rem",
          display: "flex",
          gap: ".5rem",
        }}
      >
        {settings.addIndicators && imageUrls.map((_, index) => (
          <button
            key={index}
            className="carousel-dot-btn"
            onClick={() => setImageIndex(index)}
          >
            {index === imageIndex ? <CircleDot/> : <Circle/>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
