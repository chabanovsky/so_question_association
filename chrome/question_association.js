var stackOverflowInEnglishUrl = "stackoverflow.com";
var stackOverflowInRussianUrl = "ru.stackoverflow.com";
var answersApiEndpoint = "https://api.stackexchange.com/2.2/questions/{id}/answers?pagesize=1&order=desc&sort=votes&site=ru.stackoverflow&filter=!9YdnSMKKT";
var searchApiEndpoint = "https://api.stackexchange.com/2.2/search?order=desc&sort=votes&pagesize=15&site=stackoverflow&filter=!9YdnSIN18&intitle="
var questionApiEndpoint = "https://api.stackexchange.com/2.2/questions/{id}?order=desc&sort=votes&site=stackoverflow&filter=!9YdnSIN18"
var targetPage = "/questions/";
var targetPageException = "/questions/ask";

var score_strings = ["голос", "голоса", "голосов"];

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
    // the key is id on SOen, value is id on SOru
    dataset["3211771"] = "519913";
    dataset["21573405"] = "519562"; 
    dataset["18225126"] = "519283";
    dataset["950087"] = "518486";
    dataset["63447"] = "518064";
    dataset["162304"] = "517684";
    dataset["426258"] = "517241";
    dataset["1783405"] = "516889";
    dataset["419163"] = "515852";
    dataset["1125968"] = "515435";
    dataset["1085801"] = "513017";
    dataset["2906582"] = "512862";
    dataset["38549"] = "512193";
    dataset["60174"] = "511895";
    dataset["218384"] = "511085";
    dataset["3988788"] = "510755";
}

function questionId(uri) {
    var id = /\/\d+\//.exec(uri)
    if (!id)
        return -1

    return id[0].replace(/\//g, "");
}

function isStackOverflowInEnglishQuestionPage(url) {
    return /(http|https):\/\/stackoverflow\.com\/(questions|q)\/\d+\/*/.test(url);;
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
        startLoadAnswersFromStackOverflowInRussian(dataset[id]);
    }
}

function stackOverflowInRussian(id) {
    var association = findKeyByValye(dataset, id);
    if (association) {
        startLoadStackOverflowInEnglishQuestion(association, function(data) {
            if (!data || !data.items || data.items.length == 0)
                return;

            var tmp = sidebarHTML();
            var html = $(tmp);
            var question = data.items[0]; 
            $(html).find("a").attr("href", question.link);
            $(html).find(".answer-votes").text(question.score);
            $(html).find(".question-hyperlink").text(question.title);
            if (question.is_answered) {
                $(html).find(".answer-votes").addClass("answered-accepted");
            }
            
            $(html).insertBefore($(".sidebar-linked"));
        });
    } 
    $("#question .post-menu").append("<a id='associate-link' class=''>ассоциировать</a>");
    $("#associate-link").click(function(){ 
        var popup = stackOverflowInLanguageAssociatePopupHTML();
        $(popup).insertAfter("#associate-link"); 
        $("#so-search-text").keyup(searchOnStackOverflowInEnglish);
        $("#associate").click(associateQuestion);
        if (association) {
            $("#so-search-text").val("http://stackoverflow.com/q/" + association + "/");
            $("#so-search-text").trigger("keyup");
        }
    });
}

function associateQuestion(event) {
    var url = $("#so-search-text").val();
    var isUrl = isStackOverflowInEnglishQuestionPage(url);
    if (!isUrl)
      return;

    // Do association!   
    
    $("#question-association-popup").remove();
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
    console.log("Cannot load anwers from Stack Overflow in Russian.");
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

function searchOnStackOverflowInEnglish(event) {
    var searchKey = event.target.value;
    if (searchKey.trim().length == 0) {
        stackOverflowInLanguageCloseAssociationPrview();
        return;
    }

    var isUrl = isStackOverflowInEnglishQuestionPage(searchKey);
    if (isUrl) {
        startLoadStackOverflowInEnglishQuestionHelper(questionId(searchKey));
    } else {
        startLoadSearchResultsFromStackOverflow(searchKey);
    }
}

function startLoadStackOverflowInEnglishQuestionHelper (id) {
    startLoadStackOverflowInEnglishQuestion(id, onLoadQuestionSuccessHandler)
}

function startLoadStackOverflowInEnglishQuestion(id, successCallback) {
    var url = questionApiEndpoint.replace(/\{id\}/g, id);
    $.ajax({
        url: url,
        method: 'GET',
        success: successCallback,
    	error: onLoadQuestionErrorHandler
    });  
}

function startLoadSearchResultsFromStackOverflow(searchKey) {
    var url = searchApiEndpoint + encodeURI(searchKey)
    $.ajax({
        url: url,
        method: 'GET',
        success: onSearchSuccessHandler,
    	error: onSearchErrorHandler
    });
}

function onLoadQuestionSuccessHandler(data) {
    if (!data || !data.items || data.items.length == 0)
      return;

    stackOverflowInLanguageShowAssociationPrview(data.items[0]);  
}

function onLoadQuestionErrorHandler() {
  console.log("Cannot load question from Stack Overflow in English");
}

function onSearchSuccessHandler(data) {
    if (!data || !data.items || data.items.length == 0)
      return;

    var list = $("#questions-to-associate .list");
    list.empty(); 
    
    for(var index = 0; index < data.items.length; index++) {
        var tmp = searchItemHTML();
        var template = $(tmp);
        var item = data.items[index];
        $(template).find(".vote-count-post").text(item.score);
        $(template).find(".viewcount").text(plural(parseInt(item.score), score_strings));
        $(template).find(".post-link a").attr("href", item.link);
        $(template).find(".post-link a").text(unescape(item.title));
        $(template).find(".body-summary").text(stripHtml(item.body).substr(0, 150));
        var element = list.append(template.html());
        function showQuestion(elem, question) {
            $(elem).click(function() {
                stackOverflowInLanguageShowAssociationPrview(question);
            });
        }
        showQuestion(element, item);
    }
    list.find(".item").hover(function () {
        $(this).toggleClass("hover");
    });
}

function stackOverflowInLanguageCloseAssociationPrview() {
    $("#question-association-preview").css("display", "none");
    $("#questions-to-associate").css("display", "block");
}

function stackOverflowInLanguageShowAssociationPrview(question) {
    $("#questions-to-associate").css("display", "none");
    $("#question-association-preview").css("display", "block");
    $("#question-association-preview .question").attr("data-questionid", question.question_id);
    $("#question-association-preview .vote-count-post").text(question.score);
    $("#question-association-preview .show-title a").attr("href", question.link);
    $("#question-association-preview .show-title a").text(unescape(question.title));
    $("#question-association-preview .post-text").html(question.body);
    $("#so-search-text").val(question.link);
}

function onSearchErrorHandler() {
    console.log("Cannot load search results");
}

function stackOverflowInEglishBannerHTML() {
    return "<div id='so-en-banner'><span>This question has answers in Russian </span><a id='so-en-show-more-button'>Show Top Answer</a></div>" +
    "<div id='so-en-answer' style='display:none;' class='answer'></div>";    
}

function stackOverflowInEnglishAnswerHTML() {
    return '<div><table><tbody><tr><td class="votecell"><div class="vote"><a class="vote-up-off" title="This answer is useful">up vote</a><span id="so-en-answer-score" class="vote-count-post " title="View upvote and downvote totals"></span><a class="vote-down-off" title="This answer is not useful">down vote</a></div></td><td class="answercell"><div class="post-text" id="so-en-answer-post-text"></div><table class="fw"><tbody><tr><td><a id="so-en-show-on-another-so">Go to Stack Overflow in Russian and see all answers</a></td><td style="float:right;" align="right" class="post-signature"> <div class="user-info "><div class="user-gravatar32"><a class="so-en-answer-profile-link"><div class="gravatar-wrapper-32"><img id="so-en-answer-user-avatar" alt="" width="32" height="32"></div></a></div><div class="user-details"><a class="so-en-answer-profile-link so-en-answer-username"></a><div class="-flair"><span class="reputation-score" title="reputation score " dir="ltr" id="so-en-answer-user-rep"></span></div></div></div></td></tr></tbody></table></td></tr></tbody></table></div>';
}

function stackOverflowInLanguageAssociatePopupHTML() {
    return '<div id="question-association-popup" style="position: absolute; top: 109.5px; left: calc(50% - 416px); display: block;" class="popup"><div class="popup-close"><a onclick="$(\'#question-association-popup\').remove();" title="закрыть это всплывающее сообщение (или нажмите Esc)">×</a></div><div class="close-as-duplicate-pane"><h2 class="popup-title-container">Назначить ассоциацию</h2><div><input id="so-search-text" type="text" style="width:740px" placeholder="выполните поиск, или введите ссылку на вопрос или цифровой идентификатор"><div class="search-errors search-spinner"></div><div class="original-display"><div class="preview" id="question-association-preview" style="display:none;"><div class="show-original"><div class="question" data-questionid=""><table><tbody><tr><td class="votecell"><div class="vote"><div class="vote-count-post "></div><div style="font-weight: normal;"></div></div></td><td class="postcell"><div><div class="show-title"><a class="question-hyperlink" target="_blank"></a></div><div class="post-text"></div></div></td></tr></tbody></table></div></div></div><div class="list-container" id="questions-to-associate"><div ><div class="list-originals"><div class="list"></div></div></div></div></div><a href="#" id="associate">Назначить</a></div></div>'
}

function searchItemHTML() {
    return '<div><div class="item"><div class="stats"><div class="votes"><span class="vote-count-post"></span><div class="viewcount"></div></div></div><div class="summary"><div class="post-link"><a href=""></a></div><div><span class="body-summary"></span></div></div></div></div>';
}

function sidebarHTML() {
    return '<div class="module sidebar-linked" id="association-sidebar"><h4 id="h-linked"><strong>Вопрос на других языках</strong></h4><div class="linked" data-tracker="lq=1"><div class="spacer"><a href="" title="Количество голосов («за» — «против»)"><div class="answer-votes default"></div></a><a href="" class="question-hyperlink"></a></div></div></div>';
}

function stripHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

function plural(n, forms) {
    return forms[n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2];
}

function findKeyByValye(arr, value) {
    for (var key in arr) {
        if (arr[key] == value)
            return key;
    }
    return false;
}