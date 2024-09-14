import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import left from "../animations/left.webp"
import right from "../animations/right.webp"
import vs from "../animations/vs.webp"
import stone from "../stoneslab.png"
import fall from "../animations/fall.webp"
import rise from "../animations/crack.webp"
import "./battle.css"
import GameCard from '../components/GameCard';

function Battle() {
  const [leftLightning, setLeftLightning] = useState(null);
  const [rightLightning, setRightLightning] = useState(null);
  const [versus, setVersus] = useState(null);
  const [leftLightningBox, setLeftLightningBox] = useState(false);
  const [rightLightningBox, setRightLightningBox] = useState(false);
  const [versusBox, setVersusBox] = useState(false);
  const [fallSmoke, setFallSmoke] = useState(null)
  const [fallSmokeBox, setFallSmokeBox] = useState(false);
  const [riseRocks, setRiseRocks] = useState(null)
  const [riseRocksBox, setRiseRocksBox] = useState(false);

  const [topAnimationState, setTopAnimationState] = useState(null)
  const [bottomAnimationState, setBottomAnimationState] = useState(null)

  const [cards, setCards] = useState([]);
  const [topCountry, setTopCountry] = useState({ name: "Italy", nationality: "Italian" });
  const [bottomCountry, setBottomCountry] = useState({ name: "America", nationality: "American" });

  const navigate = useNavigate(); // To handle redirects


  const newCard = (location) => {
    if (cards.length === 0) {
      navigate('/winner')
      //use context to pass the winner over
    }

    if (location === "top") {
      setBottomCountry(topCountry)
      setTopCountry(cards.pop())
    } else {
      setTopCountry(cards.pop())
    }
    setTopAnimationState("newCard")
    playVersusAnimation()
  }

  const playVersusAnimation = () => {
    if (versus === null) {
      setLeftLightning(left)
      setRightLightning(right)
      setVersus(vs)
      setLeftLightningBox(true)
      setRightLightningBox(true)
      setVersusBox(true)
      setTimeout(() => {
        setLeftLightning(null)
        setRightLightning(null)
        setTimeout(() => {
          setLeftLightningBox(false)
          setRightLightningBox(false)
        }, 10)
      }, 600)
      setTimeout(() => {
        setVersus(null)
        setTimeout(() => {
          setVersusBox(false)
        }, 10)
      }, 2000)
    }
  }

  const topWins = () => {
    setTopAnimationState("fall")
    setTimeout(() => {
      setFallSmoke(fall)
      setFallSmokeBox(true)
      setTimeout(() => {
        setFallSmoke(null)
        setTimeout(() => {
          setFallSmokeBox(false)
          newCard("top")
        }, 10)
      }, 1300)
    }, 700)
  }

  const bottomWins = () => {
    setBottomAnimationState("hit")
    setTimeout(() => {
      setTopAnimationState("rise")
    }, 400)
    setTimeout(() => {
      setRiseRocks(rise)
      setRiseRocksBox(true)
      setTimeout(() => {
        setRiseRocks(null)
        setTimeout(() => {
          setRiseRocksBox(false)
          newCard("bottom")
        }, 10)
      }, 2000)
    }, 350)
    setTimeout(() => {
      setFallSmoke(fall)
      setFallSmokeBox(true)
      setTimeout(() => {
        setFallSmoke(null)
        setTimeout(() => {
          setFallSmokeBox(false)
        }, 10)
      }, 1300)
    }, 1000)
  }

  const requestOrientationPermission = () => {
    if (DeviceOrientationEvent.requestPermission) {
      DeviceOrientationEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', (e) => {
            if (e.rotationRate.alpha > 300) {
              topWins()
            } else if (e.rotationRate.alpha < -300) {
              bottomWins()
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    requestOrientationPermission();
    // const fetchCards = async () => {
    //   try {
    //     const response = await fetch('http://localhost:5000/start_game');
    //     if (!response.ok) throw new Error('Network response was not ok');
    //     const data = await response.json();
    //     setCards(data);
    //     console.log(data)
    //     setTopCountry(data.pop())
    //     setBottomCountry(data.pop())
    //     setCurrent(null);
    //   } catch (error) {
    //     console.error(error)
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCards();
  }, [])

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      {/* <Button onClick={() => {
        bottomWins()
      }}> Play animation!</Button> */}

      <Stack sx={{ width: "100%", height: "calc(100% - 70px)", mt: 7 }} alignItems="center" direction="column">
        <Box sx={{ position: "relative", border: "1px solid white", width: "60%", height: "30%" }}>
          <Box className={topAnimationState} sx={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "cornsilk", zIndex: 3 }}>
            <GameCard country={topCountry}></GameCard>
          </Box>
        </Box>
        <Box sx={{ width: "100%", height: 150, position: "relative" }}>
          {rightLightningBox && <Box component="img" sx={{ position: "absolute", left: 200, top: 0 }} width={250} src={rightLightning} />}
          {versusBox && <Box component="img" sx={{ position: "absolute", left: 80, top: 0, zIndex: 2 }} width={250} src={versus} />}
          {leftLightningBox && <Box component="img" sx={{ position: "absolute", left: -40, top: 0 }} width={250} src={leftLightning} />}
        </Box>
        <Box sx={{ position: "relative", border: "1px solid white", width: "60%", height: "30%" }}>
          <Box className={bottomAnimationState} sx={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "white" }}>
            <GameCard country={bottomCountry}></GameCard>
          </Box>
        </Box>
      </Stack>

      <Box sx={{ backgroundImage: `url(${stone})`, width: "100%", height: 100, position: "absolute", zIndex: -1, top: "calc(100% - 100px)", left: 0 }}>
      </Box>
      {riseRocksBox && <Box component="img" sx={{ position: "absolute", left: 60, top: 220, zIndex: 999 }} width={250} src={riseRocks} />}
      {fallSmokeBox && <Box component="img" sx={{ position: "absolute", left: -60, top: "calc(100vh - 250px)", zIndex: 999 }} width={500} src={fallSmoke} />}


    </Box>
  );
}

export default Battle;