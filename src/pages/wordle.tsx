import classNames from "classnames";
import { Console, debug } from "console";
import type { NextPage } from "next";
import Head from "next/head";
import { root } from "postcss";
import React, { useState, KeyboardEvent, useEffect } from "react";
import { number } from "zod";
import { trpc } from "../utils/trpc";
import { myWordsArray } from "../utils/words";

enum LetterStatus {
  Unknown = "bg-grey-400",
  Correct = "bg-green-400",
  Misplaced = "bg-yellow-400",
  Wrong = "bg-red-400",
}

const types: string[] = [
  LetterStatus.Unknown,
  LetterStatus.Unknown,
  LetterStatus.Unknown,
  LetterStatus.Unknown,
  LetterStatus.Unknown,
];

type MyProps = {
  currentWord: string;
  correctWord: string;
  pos: number;
  currentPos: number;
};

type MyState = {
  colors: string[];
};
class WordleBox extends React.Component<MyProps, MyState> {
  allDone: boolean;
  finalWord: string;

  constructor(props: MyProps) {
    super(props);

    this.allDone = false;
    this.finalWord = "";

    this.state = {
      colors: types,
    };
  }

  render() {
    if (this.props.pos == this.props.currentPos) {
      this.finalWord = this.props.currentWord;
    }

    if (this.props.pos < this.props.currentPos && !this.allDone) {
      this.setState({ colors: this.setColors() });
      this.allDone = true;
    }

    const divClass0: string =
      "flex flex-col w-14 h-14 justify-center items-center p-6 rounded-md border-4 motion-safe:hover:scale-105 duration-500 " +
      this.state.colors[0];
    const divClass1: string =
      "flex flex-col w-14 h-14 justify-center items-center p-6 rounded-md border-4 motion-safe:hover:scale-105 duration-500 " +
      this.state.colors[1];
    const divClass2: string =
      "flex flex-col w-14 h-14 justify-center items-center p-6 rounded-md border-4 motion-safe:hover:scale-105 duration-500 " +
      this.state.colors[2];
    const divClass3: string =
      "flex flex-col w-14 h-14 justify-center items-center p-6 rounded-md border-4 motion-safe:hover:scale-105 duration-500 " +
      this.state.colors[3];
    const divClass4: string =
      "flex flex-col w-14 h-14 justify-center items-center p-6 rounded-md border-4 motion-safe:hover:scale-105 duration-500 " +
      this.state.colors[4];

    return (
      <div className="flex flex-row space-x-2">
        <div className={divClass0}>
          <h3 className="font-bold text-gray-600">{this.finalWord[0]}</h3>
        </div>
        <div className={divClass1}>
          <h3 className="font-bold text-gray-600">{this.finalWord[1]}</h3>
        </div>
        <div className={divClass2}>
          <h3 className="font-bold text-gray-600">{this.finalWord[2]}</h3>
        </div>
        <div className={divClass3}>
          <h3 className="font-bold text-gray-600">{this.finalWord[3]}</h3>
        </div>
        <div className={divClass4}>
          <h3 className="font-bold text-gray-600">{this.finalWord[4]}</h3>
        </div>
      </div>
    );
  }

  returnSquare(i: number) {
    if (i <= this.props.currentWord.length) {
      return this.props.currentWord[i];
    } else {
      return " ";
    }
  }

  countUp(counter: string) {
    let ret = 0;
    for (let i = 0; i < 5; i++) {
      if (this.props.correctWord[i] == counter) {
        ret++;
      }
    }
    return ret;
  }

  setColors() {
    const ret: string[] = [];
    for (let i = 0; i < 5; i++) {
      ret[i] = LetterStatus.Wrong;
    }

    //Go through and set all spaces correct to correct
    for (let i = 0; i < 5; i++) {
      if (this.finalWord[i] == this.props.correctWord[i]) {
        ret[i] = LetterStatus.Correct;
      }
    }

    //Go through and set all the missed
    for (let i = 0; i < 5; i++) {
      //only work on non-correct letters
      if (ret[i] != LetterStatus.Correct) {
        const howmany: number = this.countUp(this.finalWord[i] as string);
        //If only one letter we must check that it has yet to be colored in
        if (howmany != 0) {
          let alreadyCon = 0;
          for (let j = 0; j < 5; j++) {
            if (
              (ret[j] == LetterStatus.Correct ||
                ret[j] == LetterStatus.Misplaced) &&
              this.finalWord[j] == this.finalWord[i]
            ) {
              alreadyCon++;
            }
          }
          if (alreadyCon < howmany) {
            ret[i] = LetterStatus.Misplaced;
          }
        }
      }
    }
    return ret;
  }
}

const Home: NextPage = () => {
  const [theWord, setTheWord] = useState(
    myWordsArray[
      Math.round(Math.random() * myWordsArray.length + 0.5)
    ]?.toUpperCase() as string
  );

  const [currentWord, setCurrentWord] = useState("");
  const [guess, setGuess] = useState(0);

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Backspace" && currentWord.length > 0) {
      setCurrentWord(currentWord.substring(0, currentWord.length - 1));
    } else if (e.key === "Enter" && currentWord.length == 5) {
      setGuess(guess + 1);
      setCurrentWord("");
    } else if (e.key.length == 1 && currentWord.length < 5) {
      setCurrentWord(currentWord + e.key);
    }
  };

  return (
    <>
      <Head>
        <title>Wordle on Blais.gg</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="" href="" />
      </Head>

      <main
        className="p-6 justify-center items-center overflow-hidden h-screen w-screen"
        tabIndex={0}
        onKeyUpCapture={handleKeyboardEvent}
      >
        <div className="container flex flex-col items-center justify-center gap-5">
          <WordleBox
            currentWord={currentWord}
            correctWord={theWord}
            pos={0}
            currentPos={guess}
          />
          <WordleBox
            currentWord={currentWord}
            correctWord={theWord}
            pos={1}
            currentPos={guess}
          />
          <WordleBox
            currentWord={currentWord}
            correctWord={theWord}
            pos={2}
            currentPos={guess}
          />
          <WordleBox
            currentWord={currentWord}
            correctWord={theWord}
            pos={3}
            currentPos={guess}
          />
          <WordleBox
            currentWord={currentWord}
            correctWord={theWord}
            pos={4}
            currentPos={guess}
          />
          <WordleBox
            currentWord={currentWord}
            correctWord={theWord}
            pos={5}
            currentPos={guess}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
