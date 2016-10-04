var stackOverflowInEnglishUrl = "stackoverflow.com";
var stackOverflowInRussianUrl = "ru.stackoverflow.com";
var answersApiEndpoint = "https://api.stackexchange.com/2.2/questions/{id}/answers?pagesize=1&order=desc&sort=votes&site=ru.stackoverflow&filter=!9YdnSMKKT";
var targetPage = "/questions/";
var targetPageException = "/questions/ask";

var actions = {};
var dataset = {};

init();

function init() {
    var uri = document.baseURI;
    if (!uri.includes(targetPage) || uri.includes(targetPageException))
      return;
    
    setupActions();
    setupDataset();
    if (!actions[document.domain])
      return;

    actions[document.domain](questionId(uri));
}

function setupActions() {
    actions[stackOverflowInEnglishUrl] = stackOverflowInEnglish;
    actions[stackOverflowInRussianUrl] = stackOverflowInRussian;
}

function setupDataset() {
    dataset["3211771"] = { ru: 519913, en: 3211771, author: 6};
}

function questionId(uri) {
    var id = /\/\d+\//.exec(uri)
    if (!id)
        return -1

    return id[0].replace(/\//g, "");
}

function stackOverflowInEnglish(id) {
    if (!dataset[id]) 
        return;
    var answer_list = $(".answer");
    if (answer_list.length > 0) {
        var firstAnswer = answer_list[0];
        var bannerHtml = stackOverflowInEglishBannerHTML();
        var answerHtml = stackOverflowInEnglishAnswerHTML();
        $(bannerHtml).insertAfter(firstAnswer);
        $("#so-en-answer").html(answerHtml);
        $("#so-en-show-more-button").click(stackOverflowInEnglishShowAnswer);
        $("#so-en-banner").click(stackOverflowInEnglishShowAnswer);
        startLoadAnswersFromStackOverflowInRussian(dataset[id].ru);
    }
}

function stackOverflowInRussian(id) {
    $("#question .post-menu").append("<a id='associate' class=''>ассоциировать</a>");
}

function startLoadAnswersFromStackOverflowInRussian(id) {
    var url = answersApiEndpoint.replace(/\{id\}/g, id);
    $.ajax({
        url: url,
        method: 'GET',
        success: onAnswersLoadSuccessHandler,
    	  error: onAnswersLoadErrorHandler
    });
}

function onAnswersLoadSuccessHandler(data) {
    if (!data || !data.items || data.items.length == 0)
      return;
    
    var answer = data.items[0];
    $("#so-en-answer-score").text(answer.score);
    $("#so-en-answer-post-text").html(answer.body);
    $(".so-en-answer-profile-link").attr("href", answer.owner.link);
    $(".so-en-answer-username").text(answer.owner.display_name);
    $("#so-en-answer-user-rep").text(answer.owner.reputation);
    $("#so-en-answer-user-avatar").attr("src", answer.owner.profile_image);
    $("#so-en-show-on-another-so").attr("href", "//" + stackOverflowInRussianUrl + "/q/" + answer.question_id + "/6");
}

function stackOverflowInEnglishShowAnswer() {
    $("#so-en-banner").css("display", "none");
    $("#so-en-answer").css("display", "block");
}

function onAnswersLoadErrorHandler() {
    console.error("Cannot load anwers from Stack Overflow in Russian.");
}

function stackOverflowInEglishBannerHTML() {
    return "<div id='so-en-banner'><span>This question has answers in Russian </span><a id='so-en-show-more-button'>Show Top Answer</a></div>" +
    "<div id='so-en-answer' style='display:none;' class='answer'></div>";    
}

function stackOverflowInEnglishAnswerHTML() {
    return '<div><table><tbody><tr><td class="votecell"><div class="vote"><a class="vote-up-off" title="This answer is useful">up vote</a><span id="so-en-answer-score" class="vote-count-post " title="View upvote and downvote totals"></span><a class="vote-down-off" title="This answer is not useful">down vote</a></div></td><td class="answercell"><div class="post-text" id="so-en-answer-post-text"></div><table class="fw"><tbody><tr><td><a id="so-en-show-on-another-so">Go to Stack Overflow in Russian and see all answers</a></td><td style="float:right;" align="right" class="post-signature"> <div class="user-info "><div class="user-gravatar32"><a class="so-en-answer-profile-link"><div class="gravatar-wrapper-32"><img id="so-en-answer-user-avatar" alt="" width="32" height="32"></div></a></div><div class="user-details"><a class="so-en-answer-profile-link so-en-answer-username"></a><div class="-flair"><span class="reputation-score" title="reputation score " dir="ltr" id="so-en-answer-user-rep"></span></div></div></div></td></tr></tbody></table></td></tr></tbody></table></div>';
}