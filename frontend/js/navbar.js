const header = `
<section class="top-nav">
    <style>
        .logo{
            color: #fec200;
            font-family: "Fredoka One";
            font-size: 1.5rem;
            text-decoration: none;
        }

        .top-nav {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            color: #422c33;
            height: 50px;
            padding: 1em;
        }

        .menu {
            display: flex;
            flex-direction: row;
            list-style-type: none;
            margin: 0;
            padding: 0;
        }

        .menu>li {
            margin: 0 1rem;
            overflow: hidden;
            
            &:hover{
                cursor:pointer;
            }

            & a{
                text-decoration:none;
                color: #422c33;
            }
        }

        .menu-button-container {
            display: none;
            height: 100%;
            width: 30px;
            cursor: pointer;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        #menu-toggle {
            display: none;
        }

        .menu-button,
        .menu-button::before,
        .menu-button::after {
            display: block;
            background-color: #422c33;
            position: absolute;
            height: 4px;
            width: 30px;
            transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
            border-radius: 2px;
        }

        .menu-button::before {
            content: '';
            margin-top: -8px;
        }

        .menu-button::after {
            content: '';
            margin-top: 8px;
        }

        #menu-toggle:checked+.menu-button-container .menu-button::before {
            margin-top: 0px;
            transform: rotate(405deg);
        }

        #menu-toggle:checked+.menu-button-container .menu-button {
            background: rgba(0, 0, 0, 0);
        }

        #menu-toggle:checked+.menu-button-container .menu-button::after {
            margin-top: 0px;
            transform: rotate(-405deg);
        }

        @media (max-width: 700px) {
            .menu-button-container {
                display: flex;
            }

            .menu {
                position: absolute;
                top: 0;
                margin-top: 50px;
                left: 0;
                flex-direction: column;
                width: 100%;
                justify-content: center;
                align-items: center;
            }

            #menu-toggle~.menu li {
                height: 0;
                margin: 0;
                padding: 0;
                border: 0;
                transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
            }

            #menu-toggle:checked~.menu li {
                height: 2.5em;
                padding: 0.5em;
                transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);

                &:hover{
                    background-color:lightorange;
                    
                }
            }

            .menu>li {
                display: flex;
                justify-content: center;
                margin: 0;
                padding: 0.5em 0;
                width: 100%;
                color: #422c33;
                background-color: white;
            }

            .menu>li:not(:last-child) {
                border-bottom: 1px solid #444;
            }
        }
    </style>
    <div>
        <a class="logo" href="./index.html">StoryCraft</a>    
    </div>
    <input id="menu-toggle" type="checkbox" />
    <label class='menu-button-container' for="menu-toggle">
        <div class='menu-button'></div>
    </label>
    <ul class="menu">
        <li><a href="./selection.html">Build a story</a></li>
        <li><a href="./templates/explore.html">Explore</a></li>
        <li><a>
            <select name="languages" id="lang">
                <option value="english">English</option>
                <option value="kiswahili">Swahili</option>
                <option value="french">French</option>
            </select>
        </a>
        </li>
    </ul>
</section>
`
document.querySelector("body").insertAdjacentHTML("afterbegin", header);