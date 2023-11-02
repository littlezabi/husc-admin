<script lang="ts">
  import axios from "axios";
  import { Icon, XMark } from "svelte-hero-icons";
  import { updateMessages } from "$lib/store";
  import { fade, fly, slide } from "svelte/transition";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import CategoryInputView from "$compo/category-input-view.svelte";
  export let data: PageData;
  let action = data.action;
  let message: any = false;
  let changes_saved = true;
  let toggleRelativePageUrl = true;

  $: message, updateMessages(message);
  let dataFrame: any = {
    data: {
      title: "",
      pageUrl: "",
      keywords: "",
      is_new: true,
      is_active: true,
      slug: "",
    },
    info: {
      basePageUrl: "",
    },
  };
  onMount(() => {
    window.onbeforeunload = function () {
      if (!changes_saved)
        return "Are you sure you want to leave this page? changes not saved";
    };
  });

  const spreadDfItems = (product: any) => {
    dataFrame.data = { ...dataFrame.data, ...product };
    dataFrame.info._id = product._id;
    dataFrame.info.new_faculty = product.faculty
    toggleRelativePageUrl = !product.pageUrl.includes("http");
  };
  if (action !== "new") {
    spreadDfItems(data.product[0]);
  }

  const postDataframe = async () => {
    if (toggleRelativePageUrl) {
      let x = "";
      x = dataFrame.info.basePageUrl + "/" + dataFrame.data.pageUrl;
      x = x.replaceAll(/\/{2,}/gi, "/");
      if (x.endsWith("/")) x = x.substring(0, x.length - 1);
      dataFrame.data.pageUrl = x;
    }
    console.log(dataFrame);
    const form = new FormData();
    form.append("df", JSON.stringify(dataFrame.data));
    form.append("info", JSON.stringify(dataFrame.info));
    await axios
      .post(`/api/${action === "new" ? "set-items" : "update-items"}`, form, {
        headers: {
          requestFor: action === "new" ? "department-new" : "department-edit",
        },
      })
      .then((response) => {
        const res = response.data;
        console.log(res);
        if (res.error && res.error === "unauthenticated_user") {
          message = {
            message: "unauthenticated user please login!",
            variant: "danger",
          };
          return null;
        }
        if (res.success === 0)
          message = { message: res.message, variant: "danger" };
        if (res.success === 1) {
          message = { message: "successfully saved!", variant: "success" };
          changes_saved = true;
          if (action === "new")
            dataFrame = {
              data: {
                title: "",
                pageUrl: "/academics/",
                keywords: "",
                is_new: true,
                is_active: true,
                slug: "",
              },
              info: { basePageUrl: "" },
            };
        }
      })
      .catch((e) => {
        message = { message: e.message, variant: "danger" };
        console.error("error: ", e);
      });
  };
  let idsList: any = [];
  const alertIndicator = (id: string) => {
    idsList.push(id);
    idsList.forEach((e: string) => {
      (document.getElementById(e) as HTMLElement).style.borderBottomColor =
        "rgba(95, 95, 95, 0.3215686275)";
    });
    const e: any = document.getElementById(id);
    e.style.borderBottomColor = "rgb(255, 14, 0)";
    e.scrollIntoViewIfNeeded();
  };
  const handleForm = (e: any) => {
    changes_saved = false;
    e.preventDefault();
    if (toggleRelativePageUrl) {
      const pageUrl = (document.getElementById("pageUrl") as HTMLInputElement)
        ?.value;
      dataFrame.data.pageUrl = pageUrl;
    }
    message = false;
    if (dataFrame.data.title === "")
      message = {
        message: "Please enter page title.",
        variant: "alert",
        id: "title",
      };
    else if (dataFrame.info.basePageUrl === "")
      message = {
        message: "Please select a faculty for this page!",
        variant: "alert",
        id: "faculty",
      };
    else if (dataFrame.data.pageUrl === "")
      message = {
        message: "Please enter page url!",
        variant: "alert",
        id: "pageUrl",
      };
    else if (
      !toggleRelativePageUrl &&
      !dataFrame.data.pageUrl.includes("http")
    ) {
      message = {
        message:
          "Please enter a valid external url. external url must have http/https!",
        variant: "alert",
        id: "pageUrl",
      };
    } else if (dataFrame.data.keywords === "")
      message = {
        message: "Please add some keywords!",
        variant: "alert",
        id: "keywords",
      };
    if (message) {
      alertIndicator(message.id);
      return 0;
    }

    postDataframe();
  };
  const removeKeyword = (keyword: string) => {
    dataFrame.data.keywords = dataFrame.data.keywords.replace(
      keyword + ",",
      ""
    );
    changes_saved = false;
  };
  const addKeywords = (e: any) => {
    if (e.target.value.includes(",")) {
      if (!dataFrame.data.keywords.includes(e.target.value)) {
        dataFrame.data.keywords += e.target.value.trim() + " ";
      }
      e.target.value = "";
    }
    changes_saved = false;
  };

  const __npc = (e: any, name: string, checked: boolean): void => {
    if (e.target instanceof HTMLButtonElement) {
      e.target.classList.toggle("active");
      if (name === "is-active") dataFrame.data.is_active = checked;
      else dataFrame.data.is_new = checked;
    }
    changes_saved = false;
  };
  const addToDataframe = (e: any) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "slug") handleSlug(e);
    else if (name === "title") {
      dataFrame.data.title = value;
      handleSlug(e);
    } else dataFrame.data[name] = value;
    changes_saved = false;
  };
  const handleSlug = (e: Event): void => {
    if (e.target instanceof HTMLInputElement) {
      let v = e.target.value
        .replaceAll(/\s|\W|[_]/gi, "-")
        .replaceAll(/-{1,}/gi, "-")
        .toLowerCase();
      if (v.at(-1) === "-") v = v.substring(0, v.length - 1);
      dataFrame.data.slug = v;
    }
    changes_saved = false;
  };
</script>

<div class="product-new" transition:fade>
  <div class="product-inner">
    <div class="form" id="dataframe-form">
      <h2>{action === "new" ? "ADD NEW DEPARTMENTS" : "EDIT DEPARTMENTS"}</h2>
      <p>Add faculty name, url and other informations.</p>
      <form on:submit={handleForm} id="product-form">
        <div class="flex xkez">
          {#if message}
            <span class="message {message.variant}" style="margin: 10px 0;"
              >{message.message}</span
            >
          {/if}
        </div>
        <CategoryInputView
          prev_cat={action !== "new" ? { _id: dataFrame.data.faculty } : {}}
          callback={(e) => {
            dataFrame.info.new_faculty = e._id;
            dataFrame.info.basePageUrl = e.pageUrl + "/";
            if (action === "edit") {
              dataFrame.data.pageUrl = dataFrame.data.pageUrl.replace(
                dataFrame.info.basePageUrl,
                ""
              );
            }
          }}
        />

        {dataFrame.data.pageUrl}
        <div class="flex-yxz">
          <div class="a03x">
            <label for="title"
              >DEPARTMENT NAME HERE <small>(required)</small></label
            >
            <input
              type="text"
              name="title"
              id="title"
              value={action !== "new" ? dataFrame.data.title : ""}
              placeholder="E.g. Department of Zoology"
              on:change={addToDataframe}
              required
            />
          </div>
        </div>
        <div class="flex-yxz">
          <div class="a03x full-w">
            <label for="new-spec-name">
              Enter department page URL <br />
              <small
                >(URL must be relative like "/path/to/page" or external like
                "https://xyz.com/page")</small
              >
            </label>

            <div class="flex ck23493">
              <div class="tekx3">
                <button
                  class="button-x {toggleRelativePageUrl ? 'active' : ''}"
                  on:click={() => (toggleRelativePageUrl = true)}
                  type="button">Relative URL</button
                >
                <button
                  class="button-x {!toggleRelativePageUrl ? 'active' : ''}"
                  on:click={() => (toggleRelativePageUrl = false)}
                  type="button">External URL</button
                >
              </div>
              {#if toggleRelativePageUrl}
                <div class="ck234" transition:slide>
                  <button
                    type="button"
                    class="button-y"
                    on:click={() => document.getElementById("pageUrl")?.focus()}
                  >
                    {dataFrame.info.basePageUrl === ""
                      ? "/academics/faculty/"
                      : dataFrame.info.basePageUrl}
                  </button>
                  <input
                    type="text"
                    name="pageUrl"
                    value={action !== "new" ? dataFrame.data.pageUrl : ""}
                    id="pageUrl"
                    placeholder="example: /department-of-zoology-page"
                  />
                </div>
              {:else}
                <div class="ck234" style="width: 100%">
                  <input
                    style="width: 100%"
                    type="text"
                    name="pageUrl"
                    value={action !== "new" ? dataFrame.data.pageUrl : ""}
                    id="pageUrl"
                    placeholder="E.g https://www.xyz.com/dep-of-zoology"
                    on:keyup={addToDataframe}
                  />
                </div>
              {/if}
            </div>
          </div>
        </div>
        <div class="flex-yxz">
          <h3 class="spec-item-title">KEYWORDS</h3>
          <div class="keywords-list">
            {#if dataFrame.data.keywords}
              {#each dataFrame.data.keywords.split(",") as keyword}
                {#if keyword.length > 2}
                  <span>
                    {keyword}
                    <button
                      type="button"
                      on:click={() => removeKeyword(keyword)}
                      ><Icon src={XMark} /></button
                    >
                  </span>
                {/if}
              {/each}
            {/if}
          </div>
          <div class="a03x">
            <label for="keywords">
              ENTER KEYWORD <small>(seperate with comma)</small>
            </label>
            <input
              type="text"
              name="keywords"
              id="keywords"
              placeholder="Enter revelant keyword..."
              on:keyup={addKeywords}
            />
          </div>
        </div>
        <div class="jkcw">
          <div class="flex">
            <button
              type="button"
              class="btn-stylish {dataFrame.data.is_active ? 'active' : ''}"
              data-name="is-new"
              on:click={(e) => __npc(e, "is-active", !dataFrame.data.is_active)}
            />
            <span
              >DEPARTMENT VISIBLE <small
                >(toggle visibility of the department)</small
              ></span
            >
          </div>
          <div class="flex">
            <button
              type="button"
              class="btn-stylish {dataFrame.data.is_new ? 'active' : ''}"
              data-name="is-new"
              on:click={(e) => __npc(e, "is-new", !dataFrame.data.is_new)}
            />
            <span
              >SET DEPARTMENT AS NEW <small>(toggle to department as new)</small
              ></span
            >
          </div>
        </div>
        <div class="flex-yxz">
          <div class="a03x full-w">
            <label for="new-spec-name">Enter slug</label>
            <input
              type="text"
              name="slug"
              value={dataFrame.data.slug ?? ""}
              id="slug"
              required
              placeholder="E.g. department-of-zoology"
              on:keyup={addToDataframe}
            />
          </div>
        </div>
        <input type="submit" value="SAVE" />
        {#if typeof message === "object" && message !== null}
          <span
            class="message {message.variant ? message.variant : 'success'}"
            style="margin: 10px 0;">{message.message}</span
          >
        {/if}
      </form>
    </div>
  </div>
</div>

<style lang="scss">
  .product-new {
    color: var(--primary-color);
    & p {
      color: inherit;
    }
  }
  .ck23493 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .tekx3 {
    margin-top: 10px;
    & button {
      border: none;
      color: inherit;
      padding: 0 6px;
      font-size: 12px;
      border-radius: 0;
      margin: 0;
      height: 30px;
      margin-right: -3px;
      background: #6e6e6e40;
      &:hover,
      &.active {
        background: transparent;
      }
    }
  }
  .ck234 {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: flex-end;

    & button.button-y {
      border: none;
      background: none;
      color: inherit;
      border-bottom: 1px solid rgba(95, 95, 95, 0.3215686275);
      min-width: max-content;
      max-width: max-content;
      width: 100%;
      padding: 10px 0;
      font-size: 14px;
      opacity: 0.5;
    }
    & input {
      width: 230px;
    }
  }
</style>
