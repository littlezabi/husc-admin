<script>
  import { static_data } from "$lib/store";
</script>

<footer>
  <div class="page-size footer-_-3">
    <div class="c824c">
      Copyright &copy; 2022 - {new Date().getFullYear()}
      <!-- {$static_data.settings.website_name ?? ""}  -->
      All Right Reserved.
    </div>
  </div>
</footer>

<style lang="scss">
  footer {
    background: var(--secondary-bg);
    color: var(--primary-color);
    padding: 30px 10px;
    text-align: center;
  }
</style>
