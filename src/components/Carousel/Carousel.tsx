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
    [imageUrls[imageIndex], imageUrls[imageIndex + 1]])


  const currentTarget = useRef<HTMLImageElement>(null)


  const showPrevImage = () => {
    let i = 0
    setImageIndex((index) => {
      if (index === 0) {
        i = imageUrls.length - 1
      } else {
        i = index - 1
      }
      return i;
    });
    setRenderQueue((prevState) => {
      const tmp = [...prevState];
      for (let j = 0; j < imageUrls.length; j++) {
        if (j === i) {
          tmp[j] = imageUrls[j]
          console.log(j)
        }
      }
      console.log(tmp)

      return tmp
    })

  };

  // const observer = new IntersectionObserver((entries) => {
  //   entries.forEach((entry) => {
  //     if (!entry.isIntersecting) {
  //       setRenderQueue((prevState) => prevState.slice(1))
  //       setSettings({...settings, animation: false})
  //       setIsTranslated(false)
  //       isNeedTranslate.current = false
  //       observer.disconnect()
  //     }
  //   })
  // }, {
  //   threshold: 0
  // })


  const showNextImageStrip = () => {
    setImageIndex((index) => {
      if (index === imageUrls.length - 1) return 0;
      return index + 1;
    });

  };
  console.log(renderQueue)
  const showNextImageDeque = () => {
    let i = 0
    setImageIndex((index) => {
      if (index === imageUrls.length - 1) {
        i = 0
      } else {
        i = index + 1
      }
      return i;
    });
    if (renderQueue.length !== imageUrls.length) {
      setRenderQueue((prevState) => [...prevState, imageUrls[i + 1]])
    }

  }

  useEffect(() => {
      let canceled = false;

      async function loop() {
        while (!canceled && settings.autoReplay) {
          await wait(settings.autoReplayDelay)
          showNextImageDeque()
          if (settings.animation) {
            await wait(settings.animDuration)
          }
        }
      }

      // fdfddfsdfdfdf
      // if (isNeedTranslate.current) {
      //   setIsTranslated(true)
      //   if (currentTarget.current) observer.observe(currentTarget.current)
      // }


      loop()
      return () => {
        canceled = true
      }
    },
    [settings.autoReplay, settings.animation])

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
              translate: `${-100 * imageIndex}%`,
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
