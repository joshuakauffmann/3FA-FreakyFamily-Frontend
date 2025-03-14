<!-- //HTML\\ -->
<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Acme&display=swap"
  />
  <q-layout view="hHh lpR fFf">
    <!-- Standart TopBar -->
    <q-header elevated class="primaryTopBar">
      <q-toolbar id="q-toolbar">
        <q-btn
          dense
          flat
          round
          icon="menu"
          size="xl"
          color="black"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title id="q-Title"> Joshua's Playground </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- Standart TopBar -->

    <!-- Standart Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above elevated id="leftDraw">
      <q-list>
        <q-item-label header>
          <div v-for="link in linksList" :key="link.title" class="linkTitles">
            <q-item
              clickable
              :to="link.link"
              @click="setActiveLink(link.title)"
              :class="{ 'active-link': isActive(link.title) }"
            >
              <q-item-section v-if="link.icon" avatar>
                <q-icon
                  :name="link.icon"
                  :class="{ 'active-icon': isActive(link.title) }"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label :class="{ 'active-text': isActive(link.title) }">
                  {{ link.title }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-item-label>
      </q-list>
    </q-drawer>
    <!-- Standart Drawer -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<!-- //HTML\\ -->

<!-- //Script\\ -->
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

onMounted(() => {
  const route = useRoute();
  const currentLink = linksList.find((link) => link.link === route.path);
  if (currentLink) {
    setActiveLink(currentLink.title);
  } else if (linksList.length > 0) {
    setActiveLink(linksList[0].title);
  }
});

const leftDrawerOpen = ref(false);
const activeLink = ref(null);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const setActiveLink = (title) => {
  activeLink.value = title;
};

const isActive = (title) => {
  return activeLink.value === title;
};

const linksList = [
  {
    title: "Home",
    icon: "home",
    link: "/home",
  },
  {
    title: "To Do",
    icon: "list",
    link: "/uptodo",
  },
  {
    title: "Learned",
    icon: "book",
    link: "/learned",
  },
];
</script>
<!-- //Script\\ -->

<!-- //CSS\\ -->
<style>
#q-toolbar {
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  align-items: center;
}

#q-Title {
  margin-left: 1.5%;
  font-size: 40px;
  color: #000000;
}

#leftDraw {
  background-color: #01377d;

  border-right-style: solid;
  border-right-width: 3px;
  border-color: #292929;

  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.5);
}

.linkTitles {
  font-size: 27px;
  margin-top: 8%;
  font-weight: 400;
  color: white;
}

.active-link {
  background-color: #7ed348;

  border-style: solid;
  border-radius: 15px;
  border-width: 2px;
  border-color: #000000;
}

.active-icon {
  color: #000000;
}

.active-text {
  color: #000000;
}
</style>
<!-- //CSS\\ -->
