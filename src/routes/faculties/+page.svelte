<script lang="ts">
  import { goto } from "$app/navigation";
  import { getRandomColor, life } from "$lib/globals";
  import {
    AcademicCap,
    Calendar,
    CodeBracket,
    Cog8Tooth,
    Eye,
    Icon,
    Plus,
    Trash,
    Wrench,
  } from "svelte-hero-icons";
  export let data: import("./$types").PageData;
  let faculties = data.faculties;
  let list = faculties;
  const sort = (by: any): any => {
    let order = by.target.value.split("_").at(-1);
    by = by.target.value.split("_")[0];
    let comp_a = order === "asc" ? 1 : -1;
    let comp_b = order === "desc" ? 1 : -1;
    list = faculties.sort((a: any, b: any) => {
      if (a[by] > b[by]) return comp_a;
      if (a[by] < b[by]) return comp_b;
      else return 0;
    });
  };
</script>

<div class="wrapper-view">
  <h1>Academics and Faculties</h1>
  <div class="wrapper-inner">
    <div class="head">
      <p>Add, edit, update and delete Items carefully.</p>
      <div>
        <a class="btn flex" href="/faculties/new">
          <span>NEW CATEGORY</span>
          <Icon src={Plus} />
        </a>
      </div>
      <span>
        Sort By
        <select class="sort-select" on:change={(e) => sort(e)}>
          <optgroup label="By Title">
            <option value="category_asc">Ascending</option>
            <option value="category_desc">Descending</option>
          </optgroup>
          <optgroup label="By Items">
            <option value="items_asc">Ascending</option>
            <option value="items_desc">Descending</option>
          </optgroup>
        </select>
      </span>
    </div>
    <div class="container">
      <table>
        <thead>
          <tr
            class="item-head item-section"
          >
            <th>#</th>
            <th>
              <div class="flex">
                <Icon src={AcademicCap} />
                <span style="margin-left: 10px;">Faculty</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={CodeBracket} />
                <span style="margin-left: 10px;">Page URL</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={Eye} />
                <span style="margin-left: 10px;">Visiblility</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={Calendar} />
                <span style="margin-left: 10px;">Created At</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={Cog8Tooth} />
                <span style="margin-left: 10px;">Actions</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {#each list as item, i}
            <tr
              class="item-section list"
              style={`background: ${getRandomColor(0.1)}`}
            >
              <td class="item-index">{++i}</td>
              <td style="">
                {item.title}
              </td>
              <td>
                <a href={item.pageUrl} target="_blank">
                  {item.pageUrl}
                </a>
              </td>
              <td style="text-align:center;"
                >{#if item.is_active}<span style="color:green;font-weight:bold;"
                    >&check;</span
                  >{:else}
                  <span style="color:orangered;font-size:22px;font-weight:bold"
                    >&times;</span
                  >
                {/if}</td
              >
              <td>{life(item.createdAt).from()}</td>

              <td>
                <button
                  title="Edit"
                  on:click={() => goto(`/faculties/${item._id}`)}
                  ><Icon src={Wrench} /></button
                >

                <button
                  title="Delete"
                  style="margin-left: 8px;"
                  on:click={() => 1}><Icon src={Trash} /></button
                >
              </td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr
            class="item-head item-section"
          >
            <th>#</th>
            <th>
              <div class="flex">
                <Icon src={AcademicCap} />
                <span style="margin-left: 10px;">Faculty</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={CodeBracket} />
                <span style="margin-left: 10px;">Page URL</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={Eye} />
                <span style="margin-left: 10px;">Visiblility</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={Calendar} />
                <span style="margin-left: 10px;">Created At</span>
              </div>
            </th>
            <th>
              <div class="flex">
                <Icon src={Cog8Tooth} />
                <span style="margin-left: 10px;">Actions</span>
              </div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</div>

<style lang="scss">
</style>
