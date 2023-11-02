<script lang="ts">
  import { page } from "$app/stores";
  import {
    Icon,
    ChartPie,
    InformationCircle,
    ClipboardDocument,
    Users,
    Tag,
    UserGroup,
    Bars3,
    AcademicCap,
    BuildingLibrary,
  } from "svelte-hero-icons";
  let sideBarClose = true;
  let current_path = "/";
  $: $page.url.pathname, (current_path = $page.url.pathname);
</script>

<div class="side-bar" class:close={sideBarClose}>
  <button
    class="side-bar-toggler"
    class:close={sideBarClose}
    on:click={() => (sideBarClose = !sideBarClose)}
  >
    <Icon src={Bars3} />
  </button>
  <ul class="ul-top">
    <li>
      <a class={current_path === "/" ? "flex active" : "flex"} href="/">
        <Icon src={ChartPie} />
        <span>Dashboard</span>
      </a>
    </li>
    <li>
      <a
        class={current_path === "/faculties" ? "flex active" : "flex"}
        href="/faculties"
      >
        <Icon src={AcademicCap} />
        <span>Faculties</span>
      </a>
    </li>
    <li>
      <a
        class={current_path === "/departments" ? "flex active" : "flex"}
        href="/departments"
      >
        <Icon src={BuildingLibrary} />
        <span>Departments</span>
      </a>
    </li>

    <li>
      <a
        class={current_path === "/blogs" ? "flex active" : "flex"}
        href="/blogs"
      >
        <Icon src={ClipboardDocument} />
        <span>Blogs</span>
      </a>
    </li>

    <li>
      <a
        class={current_path === "/categories" ? "flex active" : "flex"}
        href="/categories"
      >
        <Icon src={Tag} />
        <span>Categories</span>
      </a>
    </li>
    <li>
      <a
        class={current_path === "/users/clients" ? "flex active" : "flex"}
        href="/users/clients"
        title="users clients"
      >
        <Icon src={UserGroup} />
        <span>Users clients</span>
      </a>
    </li>
    <li>
      <a
        class={current_path === "/users/admin" ? "flex active" : "flex"}
        href="/users/admin"
        title="users admin"
      >
        <Icon src={Users} />
        <span>Users admin</span>
      </a>
    </li>
    <li>
      <a
        class={current_path === "/informations" ? "flex active" : "flex"}
        href="/"
      >
        <Icon src={InformationCircle} />
        <span>Informations</span>
      </a>
    </li>
  </ul>
</div>

<style lang="scss">
  .side-bar {
    color: var(--primary-color);
    padding: 10px;
    height: 100%;
    position: relative;
    width: 270px;
    transition: 300ms;
    & .side-bar-toggler {
      width: 32px;
      height: 32px;
      border: 1px solid var(--light-color-border);
      padding: 3px;
      background: var(--bg-color);
      border-radius: 50%;
      text-align: center;
      display: flex;
      position: absolute;
      right: 11px;
      top: 14px;
      transition: 800ms;
      transform: rotate(21deg);
      &.close {
        transform: matrix(-1, 0, 0, -1, 0, 0);
      }
    }
    .ul-top {
      margin: 46px 0 0 0;
      cursor: pointer;
      & li {
        margin-top: 4px;
        padding: 0 5px;
        margin-left: auto;
        padding: 5px 2px;
        border-radius: 4px;
        & span {
          font-size: 14px;
          margin-left: 12px;
          transition: 300ms;
        }
      }
    }
    &.close {
      width: 38px;
      & li {
        & a {
          & span {
            margin: 0;
            font-size: 0px;
          }
        }
      }
    }
  }
</style>
