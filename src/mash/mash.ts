import {CircularLinkedList} from "@/mash/circular-linked-list";

export class Mash {
    categories: Category[] = [];
    luckyNumber: Number = 1;
    previouslyEliminatedIndex: Number = 0;
    storyLines: string[];

    constructor() {
        this.initiateCategories();
    }

    public addCategory(category: Category) {
        this.categories.push(category);
    }

    public addEmptyCategory(optionsCount: number) {
        const category = new Category("...", "...", []);
        for (let i = 0; i < optionsCount; i++) {
            category.addEmptyOption();
        }
        this.addCategory(category);
    }

    public removeCategory(category: Category) {
        this.categories = this.categories.filter(item => item != category);
    }

    public pickRandomLuckyNumber() {
        this.luckyNumber = Math.floor(Math.random() * 10) + 1;
    }

    public playRound() {
        this.eliminateNextOption();
        this.markWinners();
    }

    eliminateNextOption() {
        const optionsLinkedList = this.generateOptionsLinkedList();
        const selectionSection = this.calculateSelectionSequence();
        let option = selectionSection.pop();
        this.previouslyEliminatedIndex = optionsLinkedList.indexOf(option);
        option.isEliminated = true;
    }

    public calculateSelectionSequence(): Option[] {
        if (this.gameIsOver()) {
            console.log("Game finished")
            return [];
        }
        const optionsLinkedList = this.generateOptionsLinkedList();

        let node = optionsLinkedList.nodeAt(this.previouslyEliminatedIndex);
        const selectionSequence: Option[] = [];

        let counter = 0;
        let option: Option;
        while (counter < this.luckyNumber) {
            node = node!!.next;
            option = node!!.value;
            if (!option.isEliminated && !option.isWinner) {
                selectionSequence.push(option);
                counter++;
            }
        }

        return selectionSequence;
    }

    public reset() {
        window.location.reload()
    }

    private generateOptionsLinkedList(): CircularLinkedList<Option> {
        const optionsLinkedList = new CircularLinkedList<Option>();

        this.categories
            .flatMap(category => category.options)
            .forEach(option => optionsLinkedList.append(option))

        return optionsLinkedList
    }

    gameIsOver(): boolean {
        return this.getFinishedCategories().length === this.categories.length
    }

    markWinners() {
        this.getFinishedCategories()
            .flatMap(category => category.options)
            .filter(option => !option.isEliminated)
            .forEach(option => option.isWinner = true)
    }

    numberOfRounds(): Number {
        const allOptionsCount = this.categories
            .flatMap(category => category.options)
            .length

        return allOptionsCount - this.categories.length
    }

    highlightOption(option: Option) {
        this.categories.flatMap(category => category.options).forEach(option => option.isHighlighted = false)
        option.isHighlighted = true
    }

    compileUserStory() {
        this.storyLines = this.categories.map(category => {
            const winningOption = category.options.find(option => option.isWinner)
            return category.action + " " + winningOption.name
        })
    }

    private getFinishedCategories(): Category[] {
        return this.categories
            .filter(category => category.options.filter(option => !option.isEliminated).length == 1)
    }

    private initiateCategories() {
        this.categories.push(PredefinedCategories.MASH)
        this.categories.push(PredefinedCategories.JOB)
        this.categories.push(PredefinedCategories.CAR)
        this.categories.push(PredefinedCategories.SPOUSE)
        this.categories.push(PredefinedCategories.HOME_TOWN)
    }
}

export class Category {
    name: string;
    action: string;
    options: Option[] = [];

    constructor(name: string, action: string, options: string[]) {
        this.name = name;
        this.action = action;
        options.forEach(option => this.options.push(new Option(option)))
    }

    public addEmptyOption() {
        this.options.push(new Option("..."))
    }

    public removeOptionAtIndex(index: number) {
        this.options.splice(index, 1)
    }
}

export class Option {
    name: string;
    isEliminated: boolean = false;
    isWinner: boolean = false;
    isHighlighted: boolean = false;

    constructor(name: string) {
        this.name = name;
    }
}

const PredefinedCategories = {
    MASH: new Category("MASH", "You will live in a(n)", ["Mansion", "Apartment", "Shack", "House"]),
    JOB: new Category("JOB", "You'll work as a(n)", ["Lawyer", "Programmer", "ZooKeeper", "Astronaut", "Salesman"]),
    CAR: new Category("CAR", "You will drive a(n)",["BMW", "PEUGEOT", "AUDI", "Mercedes", "Ford"]),
    SPOUSE: new Category("SPOUSE", "You will marry", ["Brad Pitt", "John Travolta", "Wayne Rooney", "Stromae", "George Clooney"]),
    HOME_TOWN: new Category("CITIES", "You will live in", ["London", "Berlin", "Paris", "Barcelona", "Tokyo"])
}
