
import { useEffect } from 'react';
// parent hook
import { useBoard } from './useBoard'

import { BOARD_ACTIONS } from './boardReducer.js'

const { PULL_ACTIVE, BUILD_IN_WAITING } = BOARD_ACTIONS


export const usePcs = (reducer, init) => {
    // point at which initialize reducer && assets
    const [boardState, dispatchBoard] = useBoard(reducer, init)

    useEffect(() => {
        // when active pc falls, kill it
        // this useEffect will handle by pulling active
        if (!Object.keys(boardState.activePc).length && boardState.gameActive) { dispatchBoard({ type: PULL_ACTIVE }) }
        // init case, but also reset case
        // if (!Object.keys(boardState.inWaitingPc).length) { dispatchBoard({ type: BUILD_IN_WAITING }) }
    
    }, [boardState.activePc, boardState.gameActive])

    return [
        boardState, 
        dispatchBoard, 
        /*
        deps: 
        just dev buttons for dispatch
        */
    ]
}
