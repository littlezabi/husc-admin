<script lang="ts">
  import { modal, static_data, updateStaticData } from "$lib/store";
  import axios from "axios";
  import { onMount } from "svelte";
  import { ArrowPath, Icon } from "svelte-hero-icons";
  import Categories from "./categories.svelte";
  let cat_loading = false;
  let cats: any = [];
  export let callback: (e: {
    _id: string;
    pageUrl: string;
    title: string;
  }) => void;
  export let prev_cat: { _id?: string } = {};
  export let asFilter: boolean = false;
  let categories_list: any = $static_data.categories;
  const handleCat = (e: any) => {
    let c = $static_data.categories.filter(
      (t: { _id: string }) => t._id === e.target.value
    );
    callback(c[0]);
  };
  const getFaculties = async () => {
    cat_loading = true;
    await axios
      .get("/api/get-items/", { params: { getFaculty: 1 } })
      .then((e) => {
        updateStaticData({ categories: e.data.cats });
        cat_loading = false;
        categories_list = e.data.cats;
        cats = categories_list;
      })
      .catch((e) => {
        cat_loading = false;
        console.error(e);
      });
  };
  onMount(async () => {
    if (categories_list.length === 0) await getFaculties();
    if (asFilter) {
      categories_list = [
        { category: "all", type: "all", _id: "all" },
        ...categories_list,
      ];
      cats = categories_list;
    }
    cats = categories_list;
    if (prev_cat._id) {
      let x = $static_data.categories.filter(
        (e: any) => e._id === prev_cat._id
      );
      if(x.length) callback(x[0]);
    }
  });
</script>

{#if $modal.visible}
  <Categories />
{/if}
<div class="flex-yxz">
  <div class="a03x">
    <label for="category">
      {!asFilter ? "CHOOSE PRODUCT TYPE" : "SELECT TYPE"}
      {#if !asFilter}
        <small
          >(if faculty is not exist here then
          <a
            class="message success"
            style="display:inline;font-size:inherit"
            href="/faculties/new">add new faculty</a
          >)
        </small>{/if}</label
    >
    <div class="a03x full-w">
      <label for="category"
        >{!asFilter ? "CHOOSE RIGHT FACULTY" : "SELECT FACULTY"}
        {#if !asFilter}
          <a
            href="/faculties"
            class="message success"
            style="display:inline"
            target="_blank"
            title="add new faculty">(Manage FACULTIES)</a
          >{/if}
      </label>
      <div class="flex">
        <select name="_y_category" on:change={handleCat} id="faculty">
          {#if !asFilter && !prev_cat._id}
            <option selected disabled value="un-selected">Select faculty</option
            >
          {/if}
          {#if Array.isArray(cats)}
            {#if !asFilter}
              {#each cats as cat}
                {#if prev_cat._id === cat._id}
                  <option selected value={cat._id}>{cat.title}</option>
                {:else}
                  <option value={cat._id}>{cat.title}</option>
                {/if}
              {/each}
            {:else}
              {#each cats as cat}
                {#if prev_cat._id === cat._id}
                  <option selected value={cat._id}>{cat.title}</option>
                {:else}
                  <option value={cat._id}>{cat.title}</option>
                {/if}
              {/each}
            {/if}
          {/if}
        </select>
        {#if !asFilter}
          <button
            class="btn btn-small"
            type="button"
            style="margin:0 0 0 19px;width:46px;height:42px;"
            on:click={getFaculties}
          >
            <Icon class={cat_loading ? "anim-rotate" : ""} src={ArrowPath} />
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
