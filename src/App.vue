<script lang="ts">
import {defineComponent} from "vue";
import {Mash} from "@/mash/mash";

export default defineComponent({
      name: 'App',
      components: {},
      data() {
        return {
          mash: new Mash(),
          questionIndex: 0,
          optionsPerCategory: 5,
          minOptionsPerCategory: 2,
          gameStarted: false,
          gameSpeedOptions: [
            {name: 'Slow', value: 1500},
            {name: 'Regular', value: 500},
            {name: 'Fast', value: 200},
            {name: 'Fastest', value: 25},
          ],
          gameSpeed: 500
        }
      },
      methods: {
        async startGame() {
          this.gameStarted = true;
          await this.pickRandomLuckyNumber()

          let roundCounter = 0;
          while (roundCounter < this.mash.numberOfRounds()) {
            const selectionSequence = this.mash.calculateSelectionSequence()
            for (let i = 0; i < selectionSequence.length; i++) {
              await new Promise(resolve => setTimeout(() => {
                    this.mash.highlightOption(selectionSequence[i]);
                    resolve()
                  }, this.gameSpeed
              ));
            }

            await new Promise(resolve => setTimeout(() => {
                  this.mash.playRound();
                  resolve()
                }, this.gameSpeed
            ));
            roundCounter++;
          }

          this.mash.compileUserStory()
        },
        async pickRandomLuckyNumber() {
          for (let i = 0; i <= 20; i++) {
            await new Promise(resolve => setTimeout(() => {
                  this.mash.pickRandomLuckyNumber()
                  resolve()
                }, 100
            ));
          }
        }
      }
    }
)
</script>

<template>
  <div class="pageContainer">
    <div class="edit-categories-container">
      Question {{ questionIndex + 1 }} / {{ mash.categories.length - 1 }}
      <div v-for="(category, index) in mash.categories.slice(1)">
        <div v-if="index === questionIndex">
          <div>
            Category <input v-model="category.name">
          </div>
          <div>
            Action <input v-model="category.action">
          </div>
          <div v-for="(option, index) in category.options">
            <input class="optionNameInput" v-model="option.name"/>
            <button :disabled="category.options.length <= minOptionsPerCategory"
                    class="editCategoryButton"
                    @click="category.removeOptionAtIndex(index)">Remove
            </button>
            <button class="editCategoryButton"
                    v-if="index === category.options.length - 1"
                    @click="category.addEmptyOption()">Add Option
            </button>
          </div>

          <button class="navigateCategoryButton" :disabled="questionIndex === 0"
                  @click="questionIndex--">Previous
          </button>
          <button class="navigateCategoryButton" :disabled="questionIndex === mash.categories.length - 2"
                  @click="questionIndex++">Next
          </button>
          <button class="navigateCategoryButton" :disabled="questionIndex !== mash.categories.length - 2"
                  @click="mash.addEmptyCategory(optionsPerCategory); questionIndex++">Add Category
          </button>
        </div>
      </div>
    </div>

    <div class="gameSpeedOptionsContainer">
      <label v-for="gameSpeed in gameSpeedOptions" :key="gameSpeed.name">
        <input class="gameSpeedInput" type="radio" :value="gameSpeed.value" v-model="this.gameSpeed"/>
        <span>{{ gameSpeed.name }}</span>
      </label>
    </div>

    <div class="gameButtonsContainer">
      <button :disabled="this.gameStarted" class="gameActionButton" @click="startGame()">Start Game</button>
      <span class="luckyNumber"> {{ mash.luckyNumber }} </span>
      <button class="gameActionButton" @click="mash.reset()">Reset Game</button>
    </div>

    <div class="mashTitleContainer">
      <div :class="{ eliminatedOption: mashOption.isEliminated, winnerOption: mashOption.isWinner }"
           v-for="mashOption in mash.categories[0].options">
        <div class="mashTitleText" :class="{ highlighted: mashOption.isHighlighted }">
          {{ mashOption.name.charAt(0) }}
        </div>
      </div>
    </div>

    <div class="board">
      <div v-for="(category) in mash.categories.slice(1)">
        {{ category.name }}
        <div class="cell">
          <div :class="{ eliminatedOption: option.isEliminated, winnerOption: option.isWinner }"
               v-for="(option) in category.options">
            <div :class="{ highlighted: option.isHighlighted }">
              {{ option.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-if="mash.storyLines">
        <div v-for="storyLine in mash.storyLines"><b>{{ storyLine }}</b></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mashTitleContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.mashTitleText {
  font-size: 100px;
  font-weight: bold;
}

.board {
  display: flex;
  grid-gap: 15px;
  margin: 0 auto;
  width: 100%;
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 1px solid black;
  font-size: 15px;
  width: 150px;
}

.eliminatedOption {
  text-decoration: line-through;
  color: red;
}

.winnerOption {
  color: green;
  border: 1px solid green;
}

.edit-categories-container {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  align-items: center;
}

.navigateCategoryButton {
  margin: 10px;
}

.editCategoryButton {
  margin-left: 5px;
}

.pageContainer {
  display: flex;
  flex-direction: column;
}

.gameActionButton {
  margin-right: 5px;
}

.luckyNumber {
  font-size: 50px;
  margin: auto;
  font-weight: bold;
}

.gameButtonsContainer {
  display: flex;
  justify-content: center;
  height: 40px;
  margin-bottom: 50px;
}

.highlighted {
  border: 1px solid red;
}

.gameSpeedOptionsContainer {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.gameSpeedInput {
  margin-left: 10px;
}
</style>