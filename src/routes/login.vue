<template>
  <PublicView>
    <ProjectChooser />
    <h1>Login</h1>
  </PublicView>
</template>

<script>
import PublicView from "@/components/public-view";
import ProjectChooser from "@/components/project-chooser";

export default {
  name: "Login",
  components: {
    PublicView,
    ProjectChooser
  }
};
</script>
