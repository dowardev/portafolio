<template>
  <ion-page>
    <ion-router-outlet />
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import postService from "../../../services/post.vue";
import formatISO from "date-fns/formatISO";
import eventBus from "../../../EventBus";
import systemService from "../../../services/system.vue";

interface Posts {
  id: string;
  title: string;
  content: string;
  cover: { name: string; path: string; source?: string };
}

export default defineComponent({
  name: "PostsPage",
  components: {
    IonPage,
    IonRouterOutlet,
  },
  data() {
    return {
      dates: Array<string>(),
      posts: Array<Posts>(),
    };
  },
  mounted() {
    this.loadData();

    eventBus().emitter.on("event-posts1-data", (response: any) => {
      if (response.option == "next") this.nextPage(response.currentPage);

      if (response.option == "previous")
        this.previousPage(response.currentPage);

      if (response.option == "goTo") this.goToPage(response.currentPage);
    });
  },

  methods: {
    async loadData() {
      const loading = await systemService().presentLoading(
        "Obteniendo publicaciónes"
      );
      loading.present();

      const currentPage = this.$route.params.date as string;
      let dates = Array<string>();
      let posts = Array<Posts>();

      try {
        this.dates = dates = await this.getPostsDates(currentPage);
      } catch (e: any) {
        console.log(e);
        loading.dismiss();
      }

      try {
        this.posts = posts = await this.getPosts(currentPage);
        loading.dismiss();
      } catch (e: any) {
        loading.dismiss();
        console.log(e);
      }

      this.passData({ currentPage, dates, posts });
    },

    passData(data: {
      dates?: Array<string>;
      currentPage?: string;
      posts?: Array<Posts> | void;
    }) {
      eventBus().emitter.emit("event-posts2-data", {
        dates: data.dates,
        currentPage: data.currentPage,
        posts: data.posts,
      });
    },

    async nextPage(currentPage: string) {
      const index = this.dates.indexOf(currentPage);
      if (index == this.dates.length - 1) return;
      const date = this.dates[index + 1];
      await this.$router.replace("/blog/" + date.replaceAll("/", "-"));
      this.loadData();
    },

    async previousPage(currentPage: string) {
      const index = this.dates.indexOf(currentPage);
      if (index <= 0) return;
      const date = this.dates[index - 1];
      await this.$router.replace("/blog/" + date.replaceAll("/", "-"));
      this.loadData();
    },

    async goToPage(currentPage: string) {
      // const d = this.dates
      //   .map(function (e) {
      //     return e["formatted"];
      //   })
      //   .indexOf(currentPage);

      const date = this.dates.filter((element) => element == currentPage)[0];
      await this.$router.replace("/blog/" + date);
      this.loadData();
    },

    async getPosts(date: string): Promise<Array<Posts>> {
      const response = await postService().getPosts({
        date: date,
      });

      try {
        const posts = response.posts;
        await Promise.all(
          posts.map(async (element) => {
            element.cover["source"] =
              "data:image/png;base64," +
              (await postService().getImage({ name: element.cover.name })).image
                .source;
          })
        );

        return posts;
      } catch (e: any) {
        throw e.message;
      }
    },

    async getPostsDates(currentPage: string): Promise<Array<string>> {
      const response = await postService().getPostsDates({
        currentDate: currentPage,
      });

      const dates = Array<string>();
      response.dates.forEach((element) => {
        dates.push(
          formatISO(new Date(element), {
            representation: "date",
          }).replaceAll("/", "-")
        );
      });

      return dates;
    },
  },
});
</script>
