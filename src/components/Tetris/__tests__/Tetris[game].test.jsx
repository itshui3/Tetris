
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import Tetris from '../Tetris';

import { initBoard, gamePcs } from '../useTetrisHooks';

import { getPcs } from '../../../helpers/spec/getPcs';

beforeEach(() => {
    render(<Tetris initBoard={initBoard(gamePcs)} />);
});

//=====================
// [] - startGame suite
test('starting tetris should spawn an active pc', () => {
    // dependencies
    const dom_tetris = screen.getByTestId('tetris_cont');
    const dom_startGame = screen.getByTestId('startGame');

    // [0] - sanity check that board starts empty
    const prefirePcs = getPcs(dom_tetris);
    expect(prefirePcs.activePcsList.length).toBe(0);
    // [1] - start game
    fireEvent.click(dom_startGame);
    // [2] - expect there to be pieces
    const postfirePcs = getPcs(dom_tetris);
    expect(postfirePcs.activePcsList.length).toBeGreaterThanOrEqual(1);
});

test('should only start if there are no pcs in play', () => {
    // dependencies
    const dom_tetris = screen.getByTestId('tetris_cont');
    const dom_startGame = screen.getByTestId('startGame');
    const dom_downCtrl = screen.getByTestId('control_down');
    
    // [0] - start game
    fireEvent.click(dom_startGame);
    // [1] - move the pc
    fireEvent.click(dom_downCtrl);
    // [2] - get pc state
    const prefirePcs = getPcs(dom_tetris);
    // [3] - fire another start game event
    fireEvent.click(dom_startGame);
    // [4] - get pc state post firing start
    const postfirePcs = getPcs(dom_tetris);
    // [5] - expect that the game hasn't been mutated by start event
    expect(prefirePcs.activePcsList).toEqual(postfirePcs.activePcsList);
});

//====================
// [] - endGame suite
test('ending tetris should freeze active pc and prevent movement', () => {
    // dependencies
    const dom_tetris = screen.getByTestId('tetris_cont');
    const dom_startGame = screen.getByTestId('startGame');
    const dom_endGame = screen.getByTestId('endGame');
    const dom_downCtrl = screen.getByTestId('control_down');
    
    // [0] - start game
    fireEvent.click(dom_startGame);
    // [1] - sanity check that game has started 
    const prefirePcs = getPcs(dom_tetris);
    expect(prefirePcs.activePcsList.length).toBeGreaterThanOrEqual(1);
    // [2] - end the game
    fireEvent.click(dom_endGame);
    // [3] - attempt to move the pc
    fireEvent.click(dom_downCtrl);
    // [4] - fetch pc post firing movement
    const postfirePcs = getPcs(dom_tetris);
    // [4] - expect the pc to stay put
    expect(postfirePcs.activePcsList).toEqual(prefirePcs.activePcsList);
});
// vvv - leave this one for later, when I start doing drop interval testing
test('ending tetris should stop active pc from dropping asynchronously', () => undefined);

//=====================
// [] - resetGame suite
test('tetris resets, and only if game is ended', () => {
    // dependencies
    const dom_tetris = screen.getByTestId('tetris_cont');
    const dom_startGame = screen.getByTestId('startGame');
    const dom_endGame = screen.getByTestId('endGame');
    const dom_resetGame = screen.getByTestId('resetGame');

    // [0] - start game
    fireEvent.click(dom_startGame);
    // [1] - sanity check that game has started 
    const prefirePcs = getPcs(dom_tetris);
    expect(prefirePcs.activePcsList.length).toBeGreaterThanOrEqual(1);
    // [2] - expect game cannot reset
    fireEvent.click(dom_resetGame);
    const sanityPcs = getPcs(dom_tetris);
    expect(sanityPcs).toEqual(prefirePcs);
    // [3] - end game
    fireEvent.click(dom_endGame);
    // [4] - reset the game
    fireEvent.click(dom_resetGame);
    // [5] - expect game to have reset
    const postfirePcs = getPcs(dom_tetris);
    expect(postfirePcs.activePcsList.length).toBe(0);

});