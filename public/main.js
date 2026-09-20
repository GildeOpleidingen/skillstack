$(document).ready(function() {

    // Load the page
    $("#aside").load("sidebar.html");
    $("#header").load("header.html");
    $("#cardsSection").load("sections/cards.html");
    $("#roadmapSection").load("sections/roadmap.html");
    $("#tabsSection").load("sections/tabs.html");


    /*
     * TAB NAVIGATION
     */
    function switchTab(tabName) {

        $(".tab, .nav-item").removeClass("active");

        $('.tab[data-tab="' + tabName + '"]').addClass("active");
        $('.nav-item[data-tab="' + tabName + '"]').addClass("active");

        $(".tab-content").removeClass("active");
        $("#" + tabName).addClass("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    $(".tab, .nav-item").on("click", function() {

        const tabName = $(this).data("tab");

        switchTab(tabName);

    });

    /*
     * EXPAND / COLLAPSE EXERCISES
     */

    $("[data-expand]").on("click", function() {

        const target = $(this).data("expand");
        const list = $("#" + target);

        list.slideToggle(250);

        const isVisible = list.is(":visible");

        if (isVisible) {
            $(this).text("Hide exercises ↑");
        } else {
            $(this).text("Review exercises ↓");
        }

    });

    /*
     * DAILY CHALLENGE
     */

    $("#dailyChallenge").on("click", function() {

        switchTab("roadmap");

        $("#arrays").slideDown(250);

        $('button[data-expand="arrays"]')
            .text("Hide exercises ↑");

        showToast("🔥 Your next challenge is ready!");

    });

    /*
     * BUTTONS THAT SWITCH TO ANOTHER TAB
     */

    $('[data-tab="roadmap"]').on("click", function() {

        if ($(this).hasClass("tab") ||
            $(this).hasClass("nav-item")) {
            return;
        }

        switchTab("roadmap");

    });

    /*
     * TOAST MESSAGE
     */

    function showToast(message) {

        $("#toast")
            .stop(true, true)
            .text(message)
            .fadeIn(200)
            .delay(2500)
            .fadeOut(300);

    }

    /*
     * DEMO: MARK AN EXERCISE AS SOLVED
     *
     * After
     * a successful submission.
     */

    $(".exercise").on("click", function() {

        const exercise = $(this);
        const isDone = exercise.hasClass("done");

        if (!isDone) {

            showToast("💡 Solve this exercise in the coding editor!");

        }

    });

    /*
     * ROADMAP DATA
     *
     * TODO Later replace this with MySQL data.
     */

    const milestones = {

        basics: {
            number: "MILESTONE 01",
            title: "Programming Basics",
            description:
                "Learn the foundations of programming.",
            progress: "6 / 6 solved",
            xp: "+170 XP available",
            exercises: [
                ["Hello World", "Easy", 10, true],
                ["Variables", "Easy", 20, true],
                ["If / Else", "Easy", 30, true],
                ["For Loops", "Easy", 30, true],
                ["While Loops", "Easy", 30, true],
                ["Basic Calculator", "Easy", 50, true]
            ]
        },

        arrays: {
            number: "MILESTONE 02",
            title: "Arrays & Strings",
            description:
                "Learn to work with collections of data.",
            progress: "3 / 6 solved",
            xp: "+570 XP available",
            exercises: [
                ["Create an Array", "Easy", 50, true],
                ["Find the Maximum", "Easy", 70, true],
                ["Reverse an Array", "Easy", 80, true],
                ["Count Occurrences", "Medium", 100, false],
                ["Palindrome Checker", "Medium", 120, false],
                ["Two Sum", "Medium", 150, false]
            ]
        },

        functions: {
            number: "MILESTONE 03",
            title: "Functions & Recursion",
            description:
                "Master reusable functions and recursion.",
            progress: "0 / 6 solved",
            xp: "+600 XP available",
            exercises: [
                ["Create a Function", "Easy", 70, false],
                ["Return Values", "Easy", 80, false],
                ["Factorial", "Medium", 100, false],
                ["Fibonacci", "Medium", 120, false],
                ["Recursive Sum", "Medium", 120, false],
                ["Recursive Search", "Hard", 150, false]
            ]
        },

        algorithms: {
            number: "MILESTONE 04",
            title: "Data Structures & Algorithms",
            description:
                "Master sorting, searching and problem solving.",
            progress: "0 / 10 solved",
            xp: "+1,000 XP available",
            exercises: [
                ["Linear Search", "Easy", 80, false],
                ["Binary Search", "Medium", 120, false],
                ["Bubble Sort", "Easy", 80, false],
                ["Selection Sort", "Medium", 120, false],
                ["Stack", "Medium", 120, false],
                ["Queue", "Medium", 120, false]
            ]
        }

    };

    /*
     * OPEN MILESTONE MODAL
     */
    function openMilestone(milestoneId) {

        const milestone = milestones[milestoneId];

        if (!milestone) {
            return;
        }

        $("#modalEyebrow").text(milestone.number);
        $("#modalTitle").text(milestone.title);
        $("#modalDescription").text(milestone.description);
        $("#modalProgress").text(milestone.progress);
        $("#modalXP").text(milestone.xp);

        const exercises = $("#modalExercises");

        exercises.empty();

        $.each(milestone.exercises, function (index, exercise) {

            const name = exercise[0];
            const difficulty = exercise[1];
            const points = exercise[2];
            const completed = exercise[3];

            const row = $("<div>")
                .addClass("modal-exercise")
                .toggleClass("done", completed);

            const status = $("<div>")
                .addClass("modal-exercise-status")
                .text(completed ? "✓" : "○");

            const info = $("<div>")
                .addClass("modal-exercise-info");

            $("<strong>")
                .text(name)
                .appendTo(info);

            $("<small>")
                .text(difficulty + " · " + points + " XP")
                .appendTo(info);

            row.append(status, info);

            exercises.append(row);

        });

        $("#milestoneModal")
            .addClass("open")
            .css("display", "flex");

        $("body").css("overflow", "hidden");

    }

    /*
     * CLOSE MODAL
     */

    function closeMilestone() {

        $("#milestoneModal")
            .removeClass("open")
            .hide();

        $("body").css("overflow", "");

    }

    $(".checkpoint:not(:disabled)").on("click", function () {

        const milestoneId = $(this).data("milestone");

        openMilestone(milestoneId);

    });

    $(".mission-button[data-milestone]").on("click", function () {

        const milestoneId = $(this).data("milestone");

        openMilestone(milestoneId);

    });

    $("#closeMilestone").on("click", closeMilestone);

    $("#milestoneModal").on("click", function (event) {

        if (event.target === this) {
            closeMilestone();
        }

    });

    /*
     * LEADERBOARD TABS
     *
     * Demo data. Later use AJAX.
     */

    const rankings = {

        weekly: [
            ["Sarah", "2,420 XP", "24 solved", "S"],
            ["Mike", "1,850 XP", "20 solved", "M"],
            ["Jamie", "1,620 XP", "19 solved", "J"],
            ["Lucas", "1,500 XP", "18 solved", "L"],
            ["Emma", "1,420 XP", "16 solved", "E"],
            ["Alex", "1,240 XP", "12 solved", "A"]
        ],

        alltime: [
            ["Sarah", "12,420 XP", "120 solved", "S"],
            ["Mike", "10,850 XP", "108 solved", "M"],
            ["Jamie", "9,620 XP", "96 solved", "J"],
            ["Lucas", "8,500 XP", "85 solved", "L"],
            ["Emma", "7,420 XP", "74 solved", "E"],
            ["Alex", "6,240 XP", "62 solved", "A"]
        ]

    };

    function renderLeaderboard(type) {

        const rows = rankings[type];

        const leaderboard = $("#leaderboard");

        leaderboard.empty();

        $.each(rows, function (index, student) {

            const row = $("<div>")
                .addClass("ranking-row")
                .toggleClass("current-user", student[0] === "Alex");

            const number = $("<span>")
                .addClass("ranking-number")
                .text(index + 1);

            const avatar = $("<div>")
                .addClass("ranking-avatar")
                .text(student[3]);

            const name = $("<div>")
                .addClass("ranking-name");

            $("<strong>")
                .text(student[0] === "Alex"
                    ? "You · " + student[0]
                    : student[0])
                .appendTo(name);

            $("<small>")
                .text(student[2])
                .appendTo(name);

            const xp = $("<strong>")
                .addClass("ranking-xp")
                .text(student[1]);

            row.append(number, avatar, name, xp);

            leaderboard.append(row);

        });

    }

    $(".leaderboard-tab").on("click", function () {

        $(".leaderboard-tab").removeClass("active");

        $(this).addClass("active");

        const rankingType = $(this).data("ranking");

        renderLeaderboard(rankingType);

    });

    /*
     * FULL LEADERBOARD
     */

    $("#seeAllRankings").on("click", function () {

        // Replace with navigation to your real leaderboard page.
        alert("Full leaderboard coming soon!");

    });

});