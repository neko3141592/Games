(function(){
    const $doc = document;
    const $screen = $doc.getElementById('screen');
    const $status = $doc.getElementById('status');

    let nowPlayer = 0;
    let notice = false; 
    let board = Array(10);

    const init = () => {
        while($screen.firstChild) {
            $screen.removeChild($screen.firstChild);
        }
        let $startButton = $doc.createElement('button');
        let $notice = $doc.createElement('button');
        $status.textContent = 'Nim対戦ゲーム';
        $notice.textContent = '負けたことを通知';
        $notice.className = 'nomal';
        $startButton.className = 'nomal';
        $startButton.textContent = '開始';
        $startButton.addEventListener('click' , () => {
            gameInit();
        });
        $notice.addEventListener('click' , () => {
            notice ^= 1;
            if(notice) {
                $notice.style.backgroundColor = '#FF0000';
            } else {
                $notice.style.backgroundColor = '#FFFFFF';
            }
        });
        $screen.appendChild($startButton);
        $screen.appendChild($doc.createElement('br'));
        $screen.appendChild($notice);
    }

    const rand = (l , r) => {
        return Math.floor(Math.random()*(r+1-l))+l;
    }

    const boardUpdate = () => {
        let $cards = $doc.getElementsByClassName('card');
        for(let i = 0; i < 10; i++) {
            let nowCard = $cards[i];
            nowCard.textContent = board[i];
            if(board[i] == 0) {
                $cards[i].style.display = 'none';
            }
        }
    }

    const gameStart = () => {
        while($screen.firstChild) {
            $screen.removeChild($screen.firstChild);
        }
        for(let i = 0; i < 10; i++) {
            let $card = document.createElement('button');
            $card.className = "card";
            $card.textContent = board[i];
            $card.addEventListener('click' , () => {
                if(nowPlayer == 0 && board[i] > 0) {
                    let cnt;
                    while(true) {
                        cnt = prompt('何枚取るか教えてください');
                        if(board[i] >= cnt && cnt > 0) break;
                        else alert('その入力は不正です'); 
                    }
                    board[i] -= cnt;
                    boardUpdate();
                    check();
                    nowPlayer = 1;
                    
                    //CPU
                    $status.textContent = 'CPUがプレイ中です';
                    CPUturn();
                    setTimeout(() => {
                        boardUpdate();
                        check();
                        nowPlayer = 0;
                        $status.textContent = 'あなたの番です';
                    } , 3000);
                }
            })
            $screen.appendChild($card);
        }
    }

    const CPUturn = () => {
        let sum = 0;
        for(let i = 0; i < 10; i++) {
            sum ^= board[i];
        }
        if(sum == 0) {
            for(let i = 0; i < 10; i++) {
                if(board[i] > 0) {
                    let cnt = rand(1 , board[i]);
                    board[i] -= cnt;
                    break;
                }
            }
        } else {
            if(notice) $doc.body.style.backgroundColor = '#FF0000'
            for(let i = 0; i < 10; i++) {
                let flag = false;
                if(board[i] == 0) continue;
                for(let j = 0; j < board[i]; j++) {
                    let newSum = sum^board[i]^j;
                    if(newSum == 0) {
                        board[i] = j;
                        flag = true;
                    }
                }
                if(flag) break;
            }
        }
    }

    const gameInit = () => {
        gameEnd();
        $status.textContent = 'あなたの番です';
        nowPlayer = 0;
        for(let i = 0; i < 10; i++) {
            board[i] = rand(1 , 10);
        }
        gameStart();
    }

    const check = () => {
        let res = true;
        for(let i = 0; i < 10; i++) {
            if(board[i] > 0) res = false;
        }
        if(res) gameEnd();
    }

    const gameEnd = () => {
        while($screen.firstChild) {
            $screen.removeChild($screen.firstChild);
        }
        let $replayButton = document.createElement('button');
        $status.textContent = nowPlayer==1?"あなたの負け":"CPUの負け";
        $replayButton.textContent = 'もう一回';
        $replayButton.className = 'nomal';
        $replayButton.addEventListener('click' , () => {
            init();
        });
        $screen.appendChild($replayButton);
    }

    init();
})();