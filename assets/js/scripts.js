$(document).ready(function() {
    var defaultStreams = [
        "ESL_SC2",
        "OgamingSC2",
        "summit1g",
        "freecodecamp",
        "shroud",
        "habathcx",
        "RobotCaleb",
        "noobs2ninjas"
    ];

    function Stream(live, channel, logo, url, game, status, preview) {
        this.live = live;
        this.name = channel;
        this.logo = logo;
        this.url = url;
        this.game = game;
        this.preview = preview;
        if (status)
            this.status =
                status.length > 30 ? status.slice(0, 27) + "..." : status;
    }

    function classBuilder(isOn) {
        var newLi = $("li").last();
        newLi.addClass("block");
        newLi
            .find("a")
            .children(":nth-child(1)")
            .addClass("head");
        newLi
            .find(".head")
            .next()
            .addClass("body");
        newLi.find(".head img").addClass("logo");
        newLi
            .find(".logo")
            .next()
            .addClass("name");
        newLi.find(".body div").addClass("body2");
        newLi
            .find(".body2")
            .children(":nth-child(1)")
            .addClass("body2-title");
        newLi
            .find(".body2-title")
            .next()
            .addClass("body2-content");
        newLi.find(".body img").addClass("body-image");
        if (!isOn) {
            newLi.addClass("offline");
        }
    }

    function showStream(stream) {
        function src(src) {
            return " src = '" + src + "'";
        }

        console.log(stream);
        var href = "href = '" + stream.url + "' target = '_blank'";

        $("#display").append(
            "<li><a " +
                href +
                ">" +
                "<div>" +
                "<img" +
                src(stream.logo) +
                ">" +
                "<h3>" +
                stream.name +
                "</h3>" +
                "<hr></div>" +
                "<div>" +
                (stream.live
                    ? "<div><p>Playing: " +
                      stream.game +
                      "</p>" +
                      "<p>" +
                      stream.status +
                      "</p></div>" +
                      "<img" +
                      src(stream.preview) +
                      ">"
                    : "Offline") +
                "</div>" +
                "</a></li>"
        );

        classBuilder(stream.live);
    }

    function streams(streamsList) {
        streamsList.forEach(function(stream) {
            $.ajax({
                url: "https://wind-bow.gomix.me/twitch-api/streams/" + stream,
                dataType: "jsonp",
                success: function(data) {
                    if (data.stream === null) {
                        $.ajax({
                            url:
                                "https://wind-bow.gomix.me/twitch-api/" +
                                "channels/" +
                                stream,
                            dataType: "jsonp",
                            success: function(data) {
                                showStream(
                                    new Stream(
                                        false,
                                        stream,
                                        data.logo,
                                        data.url
                                    )
                                );
                            }
                        });
                    } else {
                        showStream(
                            new Stream(
                                true,
                                stream,
                                data.stream.channel.logo,
                                data.stream.channel.url,
                                data.stream.game,
                                data.stream.channel.status,
                                data.stream.preview.large
                            )
                        );
                    }
                }
            });
        });
    }

    $("#onlineButton").on("click", function() {
        $(this).addClass("active");
        $("#showAllButton").removeClass("active");
        $(".offline").hide();
    });
    $("#showAllButton").on("click", function() {
        $(this).addClass("active");
        $("#onlineButton").removeClass("active");
        $(".offline").show();
    });
    streams(defaultStreams);
});
