(() => {
    // グローバル変数を汚染しないように即時関数で囲う

    const side = 8;
    const numButtons = side * side;
    const numMines = 14;


    const initSetup = () => {
        for (let i = 0; i < numButtons; i++) {
            const newButton = document.createElement('button');
            newButton.type = "button";
            newButton.classList.add("btn");
            newButton.dataset.nav = i;
            newButton.textContent = '?';
            document.getElementById("manyButtons").appendChild(newButton);
        }


    }
    initSetup();

    const $button = document.getElementsByTagName("button");
    let mines = new Array(numButtons).fill(0);
    let clues = new Array(numButtons).fill(0);
    let first_click = true;

    //---------------------------------------------------------------------//

    // Sets up mines and clues. Runs right after initial click.
    const setup = (bn) => {
        // Set mines
        let i = 0;
        while (i < numMines) {
            let mine_pos = Math.floor(Math.random() * numButtons);
            if (mine_pos != bn) {
                mines[mine_pos] = 1;
                i++;
            }
        }
        console.log("mines:" + mines);

        // Set clues

        for (let i = 0; i < numButtons; i++) {

            if (mines[i]) {
                let increment_indices = [];
                // If i is not in top row
                if (Math.floor(i / side) != 0) {
                    increment_indices.push(i - side);
                    // if not in left column
                    if (i % side != 0) {
                        increment_indices.push(i - (side + 1));
                        increment_indices.push(i - 1);
                    }
                    // if not in right column
                    if (i % side < side - 1) {
                        increment_indices.push(i - side + 1);
                        increment_indices.push(i + 1);
                    }
                }
                // If i is not in bottom row
                if (Math.floor(i / side) < side - 1) {
                    increment_indices.push(i + side);
                    // if not in left column
                    if (i % side != 0) {
                        increment_indices.push(i + side - 1);
                        increment_indices.push(i - 1);
                    }
                    // if not in right column
                    if (i % side < side - 1) {
                        increment_indices.push(i + side + 1);
                        increment_indices.push(i + 1);
                    }
                }
                increment_indices = increment_indices.filter(
                    (item, index) => increment_indices.indexOf(item) === index
                );
                for (item of increment_indices) {
                    clues[item]++;
                }
            }
        }

    };


    const sweepHelper = (bn) => {
        $button[bn].classList.add("pushed");

        let neighbors = [];
        if (Math.floor(bn / side) != 0) {
            // if not in top row, add the button above
            let n1 = parseInt(bn) - parseInt(side);
            if (!$button[n1].classList.contains("pushed")) {
                neighbors.push(n1);
            }
            // if not in left column
            if (bn % side != 0) {
                let n2 = parseInt(bn) - 1;
                if (!$button[n2].classList.contains("pushed")) {
                    neighbors.push(n2);
                }
                let n3 = parseInt(bn) - 1 - parseInt(side);
                if (!$button[n3].classList.contains("pushed")) {
                    neighbors.push(n3);
                }
            }
            // if not in right column
            if (bn % side != side - 1) {
                let n4 = parseInt(bn) + 1;
                if (!$button[n4].classList.contains("pushed")) {
                    neighbors.push(n4);
                }
                let n5 = parseInt(bn) + 1 - parseInt(side);
                if (!$button[n5].classList.contains("pushed")) {
                    neighbors.push(n5);
                }
            }
        }
        if (Math.floor(bn / side) != side - 1) {
            // if not in bottom row, add the button below
            let n1 = parseInt(bn) + parseInt(side);
            if (!$button[n1].classList.contains("pushed")) {
                neighbors.push(n1);
            }
            // if not in left column
            if (bn % side != 0) {
                let n2 = parseInt(bn) - 1;
                if (!$button[n2].classList.contains("pushed")) {
                    neighbors.push(n2);
                }
                let n3 = parseInt(bn) - 1 + parseInt(side);
                if (!$button[n3].classList.contains("pushed")) {
                    neighbors.push(n3);
                }
            }
            // if not in right column
            if (bn % side != side - 1) {
                let n4 = parseInt(bn) + 1;
                if (!$button[n4].classList.contains("pushed")) {
                    neighbors.push(n4);
                }
                let n5 = parseInt(bn) + 1 + parseInt(side);
                if (!$button[n5].classList.contains("pushed")) {
                    neighbors.push(n5);
                }
            }
        }

        console.log(neighbors);

        // For each neighbor
        for (let i = 0; i < neighbors.length; i++) {

            if (mines[neighbors[i]]) {
                // Do nothing for now
                console.log(neighbors[i] + " is mine");
            }
            else {
                let i_clue = clues[neighbors[i]];
                if (i_clue == 0) {
                    $button[neighbors[i]].textContent = i_clue;

                    // Recurse
                    console.log("recurse to " + neighbors[i]);
                    sweepHelper(neighbors[i]);
                }
                else {
                    // Show clue
                    $button[neighbors[i]].classList.add("pushed");
                    $button[neighbors[i]].textContent = i_clue;
                    console.log("non-zero clue at " + neighbors[i]);
                }
            }
        }
    }

    const sweep = (bn) => {

        if (first_click) {
            setup(bn);
            first_click = false;
        }

        if (mines[bn]) {
            // Mine! Game Over!
            window.alert("Mine! Game Over!");
            location.reload();
        }
        else {
            $button[bn].textContent = clues[bn];
            sweepHelper(bn);


        }

    };

    const checkWin = () => {
        let unclicked = 0;
        for (let i = 0; i < numButtons; i++) {
            if (mines[i] == 0 && !$button[i].classList.contains("pushed")) {
                unclicked++;
            }
        }
        if (unclicked == 0) {
            window.alert("You win! You have evaded all mines!");
            location.reload();
        }
    }

    /* 
      Click Handler
    */
    const clickHandler = (e) => {

        // クリックした要素をピンポイントで取得
        const $this = e.target;
        // data-nav（データセット中のnav属性のもの）の値を取得
        const targetVal = $this.dataset.nav;

        if ($this.classList.contains("pushed")) {
            //
        }
        else {
            $this.classList.add("pushed");
            sweep(targetVal);

            setTimeout(() => checkWin(), 1000)

        };
    };

    let handlerIndex = 0;

    while (handlerIndex < numButtons) {
        $button[handlerIndex].addEventListener("mousedown", (e) => {
            if (e.button == 0) {
                clickHandler(e);
            }
            else {
                console.log("aaa");
            }

        });
        handlerIndex++;
    };


})();
