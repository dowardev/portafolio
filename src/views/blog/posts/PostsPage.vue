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
import { Post } from "@/services/interfaces.vue";

export default defineComponent({
  name: "PostsPage",
  components: {
    IonPage,
    IonRouterOutlet,
  },
  data() {
    return {
      dates: Array<string>(),
      posts: Array<Post>(),
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
      const loading = await systemService().presentLoading({
        message: "Obteniendo publicaciónes",
      });
      loading.present();

      let currentPage = String();
      currentPage = this.$route.params.date as string;

      if (this.$route.path == "/blog" || this.$route.path == "/blog/") {
        try {
          const response = await postService().getRecentDatePosts();
          const date = response.date;
          currentPage = formatISO(new Date(date), {
            representation: "date",
          }).replaceAll("/", "-");
          this.$router.replace("/blog/" + currentPage);
        } catch (e: any) {
          loading.dismiss();
          if (e.message == "No dates") {
            const today = formatISO(new Date(), {
              representation: "date",
            });
            this.$router.replace("/blog/" + today);
            return;
          }
          console.error(e);
          systemService().openToastErrror(e);
          return;
        }
      }

      let dates = Array<string>();
      let posts = Array<Post>();

      try {
        this.dates = dates = await this.getPostsDates(currentPage);
      } catch (e: any) {
        console.log(e);
        loading.dismiss();
        return;
      }

      try {
        this.posts = posts = await this.getPosts(currentPage);
        loading.dismiss();
      } catch (e: any) {
        loading.dismiss();
        console.error(e);
        systemService().openToastErrror(e);
        return;
      }

      this.passData({ currentPage, dates, posts });
    },

    passData(data: {
      dates: Array<string>;
      currentPage?: string;
      posts: Array<Post> | void;
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
      const date = this.dates.filter((element) => element == currentPage)[0];
      await this.$router.replace("/blog/" + date);
      this.loadData();
    },

    async getPosts(date: string): Promise<Array<Post>> {
      const query = `
            id
            title
            cover {
              source
            }
      `;
      const response = await postService().getPosts({
        date: date,
        query,
      });

      return response;
    },

    async getPostsDates(currentPage: string): Promise<Array<string>> {
      const response = await postService().getPostsDates({
        currentDate: currentPage,
      });

      const dates = Array<string>();
      response.forEach((element: any) => {
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
