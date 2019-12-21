package controllers;

import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

public class ActivityController extends Controller {

    public static class Activity {
        public String type;
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result postActivity(Http.Request request) {
        final Activity activity = request.body().parseJson(Activity.class).orElse(null);
        System.out.println(activity);
        return ok(Json.parse("{\"confetti\":\"100\"}"));
    }

}
