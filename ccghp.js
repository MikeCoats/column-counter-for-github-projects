/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 *
 * @param {String} labelCaption the text of the label to parse for points
 * @returns {number} the number of points in the label
 */
function parseLabel(labelCaption) {
  if (!labelCaption) {
    return 0;
  }

  const labelSuffixRegex = /^(\d+)[\s-:]*(?:story?)?[\s-:]*(?:points?)?$/i;
  const labelPrefixRegex = /^(?:story?)?[\s-:]*(?:points?)?[\s-:]*(\d+)$/i;

  const suffixMatched = labelSuffixRegex.exec(labelCaption);
  if (suffixMatched && suffixMatched.length > 1) {
    const parsed = parseInt(suffixMatched[1], 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  const labelPrefixResults = labelPrefixRegex.exec(labelCaption);
  if (labelPrefixResults && labelPrefixResults.length > 1) {
    const parsed = parseInt(labelPrefixResults[1], 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
}

/**
 *
 * @param {HTMLElement} labelEl the DOM tree element containing the label
 * @returns {number} the number of points in the label
 */
function getLabel(labelEl) {
  if (!labelEl) {
    return 0;
  }

  return parseLabel(labelEl.textContent.trim());
}

/**
 *
 * @param {HTMLElement} cardEl the DOM tree element containing the card
 * @param {number} cardPoints the number of points in the card
*/
function annotateCard(cardEl, cardPoints) {
  const issueCardHeader = cardEl.querySelector('.js-project-card-issue-link');
  const commentCardHeader = cardEl.querySelector('.js-comment-body');

  const cardHeader = issueCardHeader || commentCardHeader;

  if (cardHeader) {
    const cardScore = document.createElement('span');

    // Add a class to hang our styling from.
    cardScore.classList.add('ccghp__score');

    // Add a class for us to check for existence of the tag later.
    cardScore.classList.add('ccghp__card__score');
    cardScore.textContent = `${cardPoints} points`;

    const existingCardScore = cardHeader.querySelector('.ccghp__card__score');
    if (!existingCardScore) {
      cardHeader.prepend(cardScore);
    } else if (existingCardScore.textContent !== cardScore.textContent) {
      cardHeader.replaceChild(cardScore, existingCardScore);
    }
  }
}

/**
 *
 * @param {HTMLElement} cardEl the DOM tree element containing the card
 * @returns {number} the number of points in the card
 */
function getAndAnnotateCard(cardEl) {
  const labels = [];
  const labelEls = cardEl.querySelectorAll('.issue-card-label');
  labelEls.forEach(labelEl => {
    const label = getLabel(labelEl);
    labels.push(label);
  });
  const cardPoints = labels.reduce((a, b) => a + b, 0);
  annotateCard(cardEl, cardPoints);
  return cardPoints;
}

/**
 *
 * @param {HTMLElement} columnEl the DOM tree element containing the column
 * @param {number} columnPoints the number of points in the column
 */
function annotateColumn(columnEl, columnPoints) {
  const columnHeader = columnEl.querySelector('.js-project-column-name');
  if (columnHeader) {
    const columnScore = document.createElement('span');

    // Add a class to hang our styling from.
    columnScore.classList.add('ccghp__score');

    // Add a class for us to check for existence of the tag later.
    columnScore.classList.add('ccghp__column__score');
    columnScore.textContent = `${columnPoints} points`;

    const existingColumnScore = columnHeader.querySelector('.ccghp__column__score');
    if (!existingColumnScore) {
      columnHeader.prepend(columnScore);
    } else if (existingColumnScore.textContent !== columnScore.textContent) {
      columnHeader.replaceChild(columnScore, columnHeader.querySelector('.ccghp__column__score'));
    }

    const columnCardCount = columnEl.querySelector('.js-column-card-count');
    if (!columnCardCount.innerText.includes(' cards')) {
      columnCardCount.classList.add('ccghp__score');
      columnCardCount.innerText += ' cards';
    }
  }
}

/**
 *
 * @param {HTMLElement} columnEl the DOM tree element containing the column
 * @returns {number} the number of points in the column
 */
function getAndAnnotateColumn(columnEl) {
  const cards = [];
  const cardEls = columnEl.querySelectorAll('.project-card');
  cardEls.forEach(cardEl => {
    const card = getAndAnnotateCard(cardEl);
    cards.push(card);
  });

  const columnPoints = cards.reduce((a, b) => a + b, 0);
  annotateColumn(columnEl, columnPoints);
  return columnPoints;
}

/**
 *
 * @param {HTMLElement} projectEl the DOM of the project page
 * @param {number} projectPoints the number of points in the project
 */
function annotateProject(projectEl, projectPoints) {
  const projectHeader = projectEl.querySelector('.project-header').querySelector('h3');
  if (projectHeader) {
    const projectScore = document.createElement('span');

    // Add a class to hang our styling from.
    projectScore.classList.add('ccghp__score');

    // Add a class for us to check for existence of the tag later.
    projectScore.classList.add('ccghp__project__score');
    projectScore.textContent = `${projectPoints} points`;

    const existingProjectScore = projectHeader.querySelector('.ccghp__project__score');
    if (!existingProjectScore) {
      projectHeader.prepend(projectScore);
    } else if (existingProjectScore.textContent !== projectScore.textContent) {
      projectHeader.replaceChild(projectScore, existingProjectScore);
    }
  }
}

/**
 * Get and annotate the number of points in the project on the page.
 * @param {HTMLElement} projectEl the DOM of the project page
 * @returns {number} the number of points in the project
 */
function getAndAnnotateProject(projectEl) {
  // Somewhere to store the points in each column.
  const columns = [];

  // Grab all the elements that represent columns in the project.
  const columnEls = projectEl.querySelectorAll('.project-column');

  // Loop over each of the grabbed column elements.
  columnEls.forEach(columnEl => {
    // Get the points for the column and annotate its title.
    const column = getAndAnnotateColumn(columnEl);

    // Save the columns points to the array.
    columns.push(column);
  });

  // Sum the points from all the columns.
  const projectPoints = columns.reduce((a, b) => a + b, 0);

  // Annotate the project with the summed points.
  annotateProject(projectEl, projectPoints);

  // Return the summed points to the caller.
  return projectPoints;
}

/**
 * Check if we're on a 'project' page and if we are get and annotate the
 * project with its points.
 */
function main() {
  // Check to see if the body tag has the project tag.
  const projectPage = document.body.classList.contains('project-page');

  // If it does...
  if (projectPage) {
    // ...then annotate the project appropriately.
    getAndAnnotateProject(document);
  }
}

/**
 * Run the annotation builder every second and a half. This allows us to 'wait'
 * until the async calls to fill the columns have finished and for cards to be
 * moved around and their labels updated.
 */
setInterval(main, 1500);

/**
 *
 */
module.exports = {
  parseLabel,
  getLabel,
  annotateCard,
  getAndAnnotateCard,
  annotateColumn,
  getAndAnnotateColumn,
  annotateProject,
  getAndAnnotateProject,
  main
};
