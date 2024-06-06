// Copyright (c) 2024, Udal and contributors
// For license information, please see license.txt

frappe.ui.form.on("Lead_LMS", {
	customer(frm) {
        frm.set_query('project', () => {
            return {
                filters: {
                    customer: frm.doc.customer
                }
            }
        })
    },
});

frappe.ui.form.on("TFL_LD_Product_Table_LMS", {
	form_render(frm) {
        set_options_in_lead_product(frm, 'sub_category', {});
    },
    sub_category(frm, cdt, cdn) {
        const selectedSubCategory = frappe.get_doc(cdt, cdn).sub_category;

        set_options_in_lead_product(frm, 'group', {
            'sub_category': selectedSubCategory
        })
    },
    group(frm, cdt, cdn) {
        const { sub_category, group } = frappe.get_doc(cdt, cdn);
        
        set_options_in_lead_product(frm, 'finish', {
            sub_category,
            group,
        })
    },
    finish(frm, cdt, cdn) {
        const { sub_category, group, finish } = frappe.get_doc(cdt, cdn);

        set_options_in_lead_product(frm, 'brand', {
            group,
            sub_category,
            finish,
        }) 
    },
    brand(frm, cdt, cdn) {
        const { sub_category, group, finish, brand } = frappe.get_doc(cdt, cdn);

        set_options_in_lead_product(frm, 'size', {
            group,
            sub_category,
            finish,
            brand
        })
    },
    size(frm, cdt, cdn) {
        const { sub_category, group, finish, brand, size } = frappe.get_doc(cdt, cdn);
        
        set_options_in_lead_product(frm, 'unit_of_measure', {
            group,
            sub_category,
            finish,
            brand,
            size,
        })
    },
    unit_of_measure(frm, cdt, cdn) {
        const { sub_category, group, finish, brand, size, unit_of_measure } = frappe.get_doc(cdt, cdn);

        frappe.db.get_list('TFL',{
            fields:['price', 'name'],
            filters: {
                sub_category, 
                group, 
                finish, 
                brand, 
                size, 
                unit_of_measure
            }
        }).then((res) => {
            if (!!res.length) {
                frm.set_value('price', res[0].price);
            }
        })
    },
});

function set_options_in_lead_product(frm, field_name, filters) {
    frappe.db.get_list('TFL',{
        fields:[field_name], 
        filters
    }).then((res) => {
        const newOptions = new Set(res.map(val => val[field_name]));
        frm.fields_dict['lead_product'].grid.update_docfield_property(field_name, 'options', Array.from(newOptions));
    })
}

// frappe.ui.form.on("TFL_LD_Product_Table_LMS", "sub_category", function(frm, cdt, cdn) {
//     var child = locals[cdt][cdn];
//     child.tcd = get_today_date(30);
//     cur_frm.refresh_field("plan");
// })