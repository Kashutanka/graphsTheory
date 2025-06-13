(() => {
    // Задачи
    const tasks = [
        {
            id: 1,
            title: "Найти кратчайший путь от A до F",
            graph: {
                nodes: [
                    { id: "A", x: 50, y: 100 },
                    { id: "B", x: 150, y: 50 },
                    { id: "C", x: 150, y: 150 },
                    { id: "D", x: 250, y: 50 },
                    { id: "E", x: 250, y: 150 },
                    { id: "F", x: 350, y: 100 },
                ],
                edges: [
                    ["A", "B"], ["A", "C"],
                    ["B", "D"], ["C", "E"],
                    ["D", "F"], ["E", "F"]
                ]
            },
            correctPath: ["A", "B", "D", "F"],
            theory: "Для поиска кратчайшего пути применяются алгоритмы BFS и Дейкстры. В простых не взвешенных графах BFS найдёт кратчайший путь по числу рёбер."
        },
        {
            id: 2,
            title: "Проверить связность графа",
            graph: {
                nodes: [
                    { id: "A", x: 100, y: 100 },
                    { id: "B", x: 200, y: 100 },
                    { id: "C", x: 300, y: 100 },
                    { id: "D", x: 100, y: 200 },
                    { id: "E", x: 200, y: 200 },
                    { id: "F", x: 300, y: 200 },
                ],
                edges: [
                    ["A", "B"], ["B", "C"],
                    ["D", "E"]
                ]
            },
            correctAnswer: "no",
            theory: "Граф связен, если из любой вершины можно добраться до любой другой. Здесь граф несвязен, т.к. есть две компоненты."
        },
        {
            id: 3,
            title: "Найти количество компонент связности",
            graph: {
                nodes: [
                    { id: "1", x: 50, y: 100 },
                    { id: "2", x: 150, y: 50 },
                    { id: "3", x: 150, y: 150 },
                    { id: "4", x: 250, y: 100 },
                    { id: "5", x: 350, y: 100 },
                ],
                edges: [
                    ["1", "2"], ["1", "3"], ["4", "5"]
                ]
            },
            correctCount: 2,
            theory: "Компонента связности — максимальное связное подмножество вершин графа. Здесь две компоненты."
        },
        {
            id: 4,
            title: "Проверить, является ли граф двудольным",
            graph: {
                nodes: [
                    { id: "A", x: 100, y: 100 },
                    { id: "B", x: 200, y: 50 },
                    { id: "C", x: 200, y: 150 },
                    { id: "D", x: 300, y: 100 },
                ],
                edges: [
                    ["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"]
                ]
            },
            correctAnswer: "yes",
            theory: "Двудольный граф — граф, вершины которого можно разбить на два множества, и все рёбра идут между этими множествами, внутри которых рёбра отсутствуют."
        },
        {
            id: 5,
            title: "Есть ли в графе цикл?",
            graph: {
                nodes: [
                    { id: "1", x: 100, y: 100 },
                    { id: "2", x: 200, y: 100 },
                    { id: "3", x: 200, y: 200 },
                    { id: "4", x: 100, y: 200 },
                ],
                edges: [
                    ["1", "2"], ["2", "3"], ["3", "4"], ["4", "1"]
                ]
            },
            correctAnswer: "yes",
            theory: "Цикл — путь, начинающийся и заканчивающийся в одной вершине, при этом вершины (кроме начальной/конечной) не повторяются."
        },
    ];

    // DOM элементы
    const taskListDiv = document.getElementById("taskList");
    const taskBlockDiv = document.getElementById("taskBlock");
    const backBtn = document.getElementById("backBtn");
    const taskTitle = document.getElementById("taskTitle");
    const graphSvg = document.getElementById("graphSvg");
    const pathDisplay = document.getElementById("pathDisplay");
    const undoBtn = document.getElementById("undoBtn");
    const checkBtn = document.getElementById("checkBtn");
    const showTheoryBtn = document.getElementById("showTheoryBtn");
    const resultDiv = document.getElementById("result");
    const theoryBlock = document.getElementById("theoryBlock");
    const theoryText = document.getElementById("theoryText");

    let currentTask = null;
    let selectedPath = [];

    function initTaskList() {
        tasks.forEach(t => {
            const btn = document.createElement("button");
            btn.textContent = t.title;
            btn.onclick = () => loadTask(t.id);
            taskListDiv.appendChild(btn);
        });
    }

    function loadTask(id) {
        currentTask = tasks.find(t => t.id === id);
        if (!currentTask) {
            alert("Задача не найдена");
            return;
        }
        selectedPath = [];
        taskTitle.textContent = currentTask.title;
        pathDisplay.textContent = "";
        resultDiv.textContent = "";
        theoryBlock.style.display = "none";
        taskListDiv.style.display = "none";
        taskBlockDiv.style.display = "block";

        drawGraph(currentTask.graph);
    }

    function drawGraph(graph) {
        graphSvg.innerHTML = "";

        // Создаем группу для всех элементов графа
        const graphGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

        // Рисуем рёбра
        graph.edges.forEach(([from, to]) => {
            const n1 = graph.nodes.find(n => n.id === from);
            const n2 = graph.nodes.find(n => n.id === to);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", n1.x);
            line.setAttribute("y1", n1.y);
            line.setAttribute("x2", n2.x);
            line.setAttribute("y2", n2.y);
            line.setAttribute("stroke", "#48484a");
            line.setAttribute("stroke-width", "3");
            graphGroup.appendChild(line);
        });

        // Рисуем вершины
        graph.nodes.forEach(n => {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", n.x);
            circle.setAttribute("cy", n.y);
            circle.setAttribute("r", 20);
            circle.setAttribute("data-id", n.id);
            circle.classList.add("node");
            circle.addEventListener("click", function () {
                selectNode(n.id, this);
            });
            graphGroup.appendChild(circle);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", n.x);
            text.setAttribute("y", n.y + 7);
            text.setAttribute("text-anchor", "middle");
            text.textContent = n.id;
            graphGroup.appendChild(text);
        });

        // Добавляем группу в SVG
        graphSvg.appendChild(graphGroup);

        // Центрируем граф
        centerGraph();
    }

    function centerGraph() {
        const svgWidth = graphSvg.width.baseVal.value;
        const svgHeight = graphSvg.height.baseVal.value;

        // Получаем границы содержимого
        const bbox = graphSvg.getBBox();

        // Вычисляем масштаб, чтобы граф вписывался в SVG
        const scale = Math.min(
            (svgWidth - 40) / bbox.width,
            (svgHeight - 40) / bbox.height
        );

        // Вычисляем смещение для центрирования
        const dx = (svgWidth - bbox.width * scale) / 2 - bbox.x * scale;
        const dy = (svgHeight - bbox.height * scale) / 2 - bbox.y * scale;

        // Применяем трансформацию к группе
        const graphGroup = graphSvg.querySelector("g");
        graphGroup.setAttribute("transform", `translate(${dx}, ${dy}) scale(${scale})`);
    }

    function selectNode(id, circleElement) {
        // Для задач с путём — собираем путь по выбранным вершинам
        // Для задач проверки ответа — по разному. Пока универсально:

        // Если задача про путь (например задача 1), тогда можно выбирать путь из нескольких вершин
        // Для других — выбираем по одному

        if (currentTask.id === 1) {
            // путь можно выбирать несколько вершин по порядку, но только по рёбрам
            if (selectedPath.length === 0) {
                selectedPath.push(id);
                circleElement.classList.add("selected");
            } else {
                // проверяем, что новая вершина связана с последней
                const last = selectedPath[selectedPath.length - 1];
                const edgeExists = currentTask.graph.edges.some(([f, t]) => (f === last && t === id) || (t === last && f === id));
                if (edgeExists && !selectedPath.includes(id)) {
                    selectedPath.push(id);
                    circleElement.classList.add("selected");
                } else {
                    alert("Выберите соседнюю вершину, не входящую в путь.");
                }
            }
        } else if (currentTask.id === 3) {
            // выбираем число компонент - тут будет ввод в prompt (здесь нет выбора вершин)
            alert("Для этой задачи ответ вводится через кнопку Проверить");
            return;
        } else {
            // для остальных задач выбираем одну вершину - переключаем выбор
            if (selectedPath.includes(id)) {
                selectedPath = selectedPath.filter(x => x !== id);
                circleElement.classList.remove("selected");
            } else {
                // снимаем выделение со всех и выделяем только эту
                document.querySelectorAll("#graphSvg circle.selected").forEach(c => c.classList.remove("selected"));
                selectedPath = [id];
                circleElement.classList.add("selected");
            }
        }
        pathDisplay.textContent = selectedPath.join(" → ");
    }

    undoBtn.onclick = () => {
        selectedPath = [];
        document.querySelectorAll("#graphSvg circle.selected").forEach(c => c.classList.remove("selected"));
        pathDisplay.textContent = "";
        resultDiv.textContent = "";
    };

    backBtn.onclick = () => {
        taskBlockDiv.style.display = "none";
        taskListDiv.style.display = "block";
        selectedPath = [];
        resultDiv.textContent = "";
        theoryBlock.style.display = "none";
    };

    showTheoryBtn.onclick = () => {
        if (theoryBlock.style.display === "none") {
            theoryText.textContent = currentTask.theory;
            theoryBlock.style.display = "block";
            showTheoryBtn.textContent = "Скрыть теорию";
        } else {
            theoryBlock.style.display = "none";
            showTheoryBtn.textContent = "Показать теорию";
        }
    };

    checkBtn.onclick = () => {
        if (!currentTask) return;

        let res = "";
        switch (currentTask.id) {
            case 1:
                // проверяем путь
                if (arraysEqual(selectedPath, currentTask.correctPath)) {
                    res = "Правильно! Кратчайший путь найден.";
                } else {
                    res = "Неправильно. Попробуйте выбрать путь ещё раз.";
                }
                break;
            case 2:
                // проверка связности — выбираем yes/no
                const ans = prompt("Граф связен? (yes/no)").toLowerCase();
                if (ans === currentTask.correctAnswer) {
                    res = "Верно! Граф " + (ans === "yes" ? "связен." : "несвязен.");
                } else {
                    res = "Неверно. Попробуйте снова.";
                }
                break;
            case 3:
                // ввод числа компонент связности
                const num = prompt("Сколько компонент связности в графе?");
                if (parseInt(num) === currentTask.correctCount) {
                    res = "Правильно! Компонент связности: " + num;
                } else {
                    res = "Неправильно. Попробуйте снова.";
                }
                break;
            case 4:
                // проверка двудольности yes/no
                const ans2 = prompt("Граф двудольный? (yes/no)").toLowerCase();
                if (ans2 === currentTask.correctAnswer) {
                    res = "Верно! Граф " + (ans2 === "yes" ? "двудольный." : "не двудольный.");
                } else {
                    res = "Неверно. Попробуйте снова.";
                }
                break;
            case 5:
                // проверка наличия цикла yes/no
                const ans3 = prompt("Есть ли в графе цикл? (yes/no)").toLowerCase();
                if (ans3 === currentTask.correctAnswer) {
                    res = "Верно! Цикл " + (ans3 === "yes" ? "есть." : "отсутствует.");
                } else {
                    res = "Неверно. Попробуйте снова.";
                }
                break;
            default:
                res = "Проверка для этой задачи не реализована.";
        }

        resultDiv.textContent = res;
    };

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    initTaskList();
})();